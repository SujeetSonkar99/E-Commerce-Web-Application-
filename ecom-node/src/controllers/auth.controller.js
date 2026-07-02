const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateJwtCookie } = require('../utils/jwt.utils');
const { paginate, buildPageResponse } = require('../utils/pagination.utils');
const { ROLES } = require('../config/constants');
const { constructImageUrl } = require('../utils/file.utils');

// POST /api/auth/signin
const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ message: 'Bad credentials - User not found', status: false });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: 'Bad credentials - Incorrect password', status: false });
    }

    // Generate Token & Cookie
    const { token, cookieOptions } = generateJwtCookie(user.userName);
    res.cookie('eShopAuth', token, cookieOptions);
    
    return res.status(200).json({
      id: user._id,
      username: user.userName,
      email: user.email,
      roles: user.roles,
      jwtToken: token,
      avatarUrl: user.avatar ? constructImageUrl(user.avatar) : null
    });
  } catch (err) {
    console.error("🚨 SIGNIN ERROR:", err); // This will print the exact error in your terminal
    return res.status(500).json({ message: "Internal Server Error during signin" });
  }
};

// POST /api/auth/upload-profile-picture (or similar route)
// MOVED OUTSIDE OF SIGNIN
const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found', status: false });
    
    if (!req.file) return res.status(400).json({ message: 'No image file provided', status: false });

    // Save the new filename to the user's document
    user.avatar = req.file.filename;
    await user.save();

    return res.status(200).json({ 
      message: 'Profile picture updated successfully',
      avatarUrl: constructImageUrl(user.avatar) 
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check existing users
    if (await User.findOne({ userName: username })) {
      return res.status(400).json({ message: 'Error: Username is already taken!' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Error: Email is already in use!' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Assign Roles
    let roles = ['ROLE_USER'];
    if (role && Array.isArray(role)) {
      roles = role.map(r => {
        if (r === 'admin') return 'ROLE_ADMIN';
        if (r === 'seller') return 'ROLE_SELLER';
        return 'ROLE_USER';
      });
    }

    // Create User
    await User.create({ userName: username, email, password: hashed, roles });
    return res.status(200).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error("🚨 SIGNUP ERROR:", err); // This will print the exact error in your terminal
    return res.status(500).json({ message: err.message || "Internal Server Error during signup" });
  }
};

// GET /api/auth/username
const getCurrentUsername = (req, res) => {
  return res.status(200).json(req.user ? req.user.userName : 'Null');
};

// GET /api/auth/user
const getUserDetails = (req, res) => {
  const user = req.user;
  return res.status(200).json({
    id: user._id,
    username: user.userName,
    email: user.email,
    roles: user.roles,
    avatarUrl: user.avatar ? constructImageUrl(user.avatar) : null
  });
};

// POST /api/auth/signout
const signout = (req, res) => {
  res.clearCookie('eShopAuth', { path: '/' });
  return res.status(200).json({ message: 'You have been signed out' });
};

// GET /api/auth/sellers
const getAllSellers = async (req, res) => {
  try {
    const { pageNumber = 0, pageSize = 50 } = req.query;
    const { skip, limit, sort } = paginate(pageNumber, pageSize, '_id', 'desc');
    const [sellers, total] = await Promise.all([
      User.find({ roles: ROLES.SELLER }).sort(sort).skip(skip).limit(limit).select('-password'),
      User.countDocuments({ roles: ROLES.SELLER }),
    ]);
    return res.status(200).json(buildPageResponse(sellers, total, pageNumber, pageSize));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { signin, signup, getCurrentUsername, getUserDetails, signout, getAllSellers,uploadProfilePicture };
