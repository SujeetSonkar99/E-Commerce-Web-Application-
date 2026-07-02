const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const populateCart = (cart) => ({
  cartId: cart._id,
  totalPrice: cart.totalPrice,
  products: cart.cartItems.map(item => ({
    productId: item.product._id || item.product,
    productName: item.product.productName,
    image: item.product.image,
    description: item.product.description,
    quantity: item.quantity,
    price: item.product.price,
    discount: item.discount,
    specialPrice: item.productPrice,
  })),
});

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, cartItems: [], totalPrice: 0 });
    cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
  }
  return cart;
};

// POST /api/carts/products/:productId/quantity/:quantity
const addProductToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.params;
    const qty = parseInt(quantity);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found', status: false });

    let cart = await getOrCreateCart(req.user._id);

    const existingItem = cart.cartItems.find(i => i.product._id.toString() === productId);
    if (existingItem) return res.status(400).json({ message: `Product ${product.productName} already exists in the cart`, status: false });
    if (product.quantity === 0) return res.status(400).json({ message: `${product.productName} is not available`, status: false });
    if (product.quantity < qty) return res.status(400).json({ message: `Order quantity exceeds available stock (${product.quantity})`, status: false });

    cart.cartItems.push({ product: product._id, quantity: qty, discount: product.discount, productPrice: product.specialPrice });
    cart.totalPrice += product.specialPrice * qty;
    await cart.save();
    cart = await Cart.findById(cart._id).populate('cartItems.product');
    return res.status(201).json(populateCart(cart));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/cart/create
const createOrUpdateCart = async (req, res) => {
  try {
    const cartItems = req.body; // Array of { productId, quantity }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, cartItems: [], totalPrice: 0 });
    } else {
      cart.cartItems = [];
      cart.totalPrice = 0;
    }

    let total = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}`, status: false });
      total += product.specialPrice * item.quantity;
      cart.cartItems.push({ product: product._id, quantity: item.quantity, discount: product.discount, productPrice: product.specialPrice });
    }
    cart.totalPrice = total;
    await cart.save();
    return res.status(201).json({ message: 'Cart created/updated with the new items successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('cartItems.product');
    if (!carts.length) return res.status(400).json({ message: 'No Cart Exist', status: false });
    return res.status(200).json(carts.map(populateCart));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/carts/users/cart
const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found', status: false });
    return res.status(200).json(populateCart(cart));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/products/:productId/quantity/:operation
const updateCartProduct = async (req, res) => {
  try {
    const { productId, operation } = req.params;
    const change = operation.toLowerCase() === 'delete' ? -1 : 1;

    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found', status: false });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found', status: false });
    if (product.quantity === 0) return res.status(400).json({ message: `${product.productName} is not available`, status: false });

    const itemIndex = cart.cartItems.findIndex(i => i.product._id.toString() === productId);
    if (itemIndex === -1) return res.status(400).json({ message: `Product ${product.productName} not available in cart`, status: false });

    const newQty = cart.cartItems[itemIndex].quantity + change;
    if (newQty < 0) return res.status(400).json({ message: 'The resulting quantity cannot be negative', status: false });

    if (newQty === 0) {
      cart.totalPrice -= cart.cartItems[itemIndex].productPrice * cart.cartItems[itemIndex].quantity;
      cart.cartItems.splice(itemIndex, 1);
    } else {
      cart.totalPrice += cart.cartItems[itemIndex].productPrice * change;
      cart.cartItems[itemIndex].quantity = newQty;
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('cartItems.product');
    return res.status(200).json(populateCart(updatedCart));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/carts/:cartId/product/:productId
const deleteProductFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await Cart.findById(cartId).populate('cartItems.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found', status: false });

    const itemIndex = cart.cartItems.findIndex(i => i.product._id.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not found in cart', status: false });

    const item = cart.cartItems[itemIndex];
    cart.totalPrice -= item.productPrice * item.quantity;
    const productName = item.product.productName;
    cart.cartItems.splice(itemIndex, 1);
    await cart.save();
    return res.status(200).json(`Product ${productName} removed from the cart!`);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { addProductToCart, createOrUpdateCart, getAllCarts, getUserCart, updateCartProduct, deleteProductFromCart };
