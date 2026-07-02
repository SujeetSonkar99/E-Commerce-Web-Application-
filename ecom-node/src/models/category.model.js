const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    minlength: [2, 'Category name must contain at least 5 characters'],
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
