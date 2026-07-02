const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 120,
  },
  roles: {
    type: [String],
    enum: ['ROLE_USER', 'ROLE_SELLER', 'ROLE_ADMIN'],
    default: ['ROLE_USER'],
  },
  avatar: { 
    type: String, 
    default: 'default-avatar.png' // Default image if the user hasn't uploaded one
  },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
