const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    minlength: [2, 'Product name must have at least 2 characters'],
    trim: true,
  },
  image: { type: String, default: 'default.png' },
  description: {
    type: String,
    required: true,
    minlength: [5, 'Product description must have at least 5 characters'],
  },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  specialPrice: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // seller
}, { timestamps: true });

// Auto-calculate specialPrice before save
productSchema.pre('save', function (next) {
  this.specialPrice = this.price - (this.discount * 0.01 * this.price);
  next();
});

module.exports = mongoose.model('Product', productSchema);
