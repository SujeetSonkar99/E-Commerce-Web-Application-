const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Address = require('../models/address.model');
const Product = require('../models/product.model');
const { paginate, buildPageResponse } = require('../utils/pagination.utils');
const Razorpay = require('razorpay');
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/order/razorpay-order
const createRazorpayOrder = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys not configured' });
    }
    
    // Create the Razorpay instance locally inside the function
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found', status: false });
    }
    
    const amountInPaise = Math.round(cart.totalPrice * 100);
    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${req.user._id}_${Date.now()}`,
    });
    
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message, status: false });
  }
};

const formatOrderItem = (item) => ({
  orderItemId: item._id,
  product: item.product
    ? {
        productId: item.product._id,
        productName: item.product.productName,
        image: item.product.image,
        description: item.product.description,
        quantity: item.product.quantity,
        price: item.product.price,
        discount: item.product.discount,
        specialPrice: item.product.specialPrice,
      }
    : null,
  quantity: item.quantity,
  discount: item.discount,
  orderProductPrice: item.orderProductPrice,
});

const formatOrder = (o) => ({
  orderId: o._id,
  email: o.email,
  orderItems: (o.orderItems || []).map(formatOrderItem),
  orderDate: o.orderDate,
  payment: o.payment || null,
  totalAmount: o.totalAmount,
  orderStatus: o.orderStatus,
  addressId: o.address?._id || o.address,
});

// POST /api/order/users/payments/:paymentMethod
const placeOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.params;
    const { addressId, pgName, pgPaymentId, pgStatus, pgResponseMessage } = req.body;
    const email = req.user.email;

    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found', status: false });
    if (!cart.cartItems.length) return res.status(400).json({ message: 'Cart is Empty', status: false });

    const address = await Address.findById(addressId);
    if (!address) return res.status(404).json({ message: 'Address not found', status: false });

    const orderItems = cart.cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      discount: item.discount,
      orderProductPrice: item.productPrice, // Ensure this matches your schema
    }));

    const order = await Order.create({
      email,
      orderItems,
      totalAmount: cart.totalPrice,
      orderStatus: 'Order Accepted !',
      address: addressId,
      payment: { paymentMethod, pgPaymentId, pgStatus, pgResponse: pgResponseMessage, pgName },
    });

    // Update product stock and clear cart
    for (const item of cart.cartItems) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { quantity: -item.quantity } });
    }
    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    const populated = await Order.findById(order._id).populate('orderItems.product address');
    return res.status(201).json(formatOrder(populated));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const { pageNumber = 0, pageSize = 50, sortBy = 'totalAmount', sortOrder = 'asc' } = req.query;
    const { skip, limit, sort } = paginate(pageNumber, pageSize, sortBy, sortOrder);
    const [orders, total] = await Promise.all([
      Order.find().sort(sort).skip(skip).limit(limit).populate('orderItems.product address'),
      Order.countDocuments(),
    ]);
    return res.status(200).json(buildPageResponse(orders.map(formatOrder), total, pageNumber, pageSize));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/seller/orders
const getAllSellerOrders = async (req, res) => {
  try {
    const { pageNumber = 0, pageSize = 50, sortBy = 'totalAmount', sortOrder = 'asc' } = req.query;
    const { skip, limit, sort } = paginate(pageNumber, pageSize, sortBy, sortOrder);
    const sellerId = req.user._id.toString();

    const allOrders = await Order.find().sort(sort).populate('orderItems.product address');
    const total = await Order.countDocuments();

    const sellerOrders = allOrders.filter(order =>
      order.orderItems.some(item => item.product?.user?.toString() === sellerId)
    );
    const paginated = sellerOrders.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json(buildPageResponse(paginated.map(formatOrder), sellerOrders.length, pageNumber, pageSize));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/orders/:orderId/status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus: req.body.status },
      { new: true }
    ).populate('orderItems.product address');
    if (!order) return res.status(404).json({ message: 'Order not found', status: false });
    return res.status(200).json(formatOrder(order));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/order/stripe-client-secret
const stripePayment = async (req, res) => {
  try {
    // 1. Move the initialization inside the function!
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return res.status(500).json({ message: 'Stripe key missing from .env', status: false });
    }
    const stripe = require('stripe')(stripeSecret);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found', status: false });
    }

    const amountInSmallestUnit = Math.round(cart.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: 'usd', 
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    return res.status(500).json({ message: err.message, status: false });
  }
};

module.exports = { 
  placeOrder, 
  getAllOrders, 
  getAllSellerOrders, 
  updateOrderStatus, 
  stripePayment,
  createRazorpayOrder 
};
