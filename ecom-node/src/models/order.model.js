const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  orderProductPrice: { type: Number, required: true },
}, { _id: true });

const paymentSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    required: true,
    minlength: [2, 'Payment method must contain at least 2 characters'],
  },
  pgPaymentId: String,
  pgStatus: String,
  pgResponse: String,
  pgName: String,
}, { _id: true });

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orderItems: [orderItemSchema],
  orderDate: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, default: 'Order Accepted !' },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  payment: paymentSchema,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
