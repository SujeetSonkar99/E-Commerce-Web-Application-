const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    minlength: [5, 'Street name must be at least 5 characters'],
    trim: true,
  },
  buildingName: {
    type: String,
    required: true,
    minlength: [5, 'Building name must be at least 5 characters'],
    trim: true,
  },
  city: {
    type: String,
    required: true,
    minlength: [4, 'City name must be at least 4 characters'],
    trim: true,
  },
  state: {
    type: String,
    required: true,
    minlength: [2, 'State name must be at least 2 characters'],
    trim: true,
  },
  country: {
    type: String,
    required: true,
    minlength: [2, 'Country name must be at least 2 characters'],
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    minlength: [6, 'Pincode must be at least 6 characters'],
    trim: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
