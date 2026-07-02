const Address = require('../models/address.model');
const User = require('../models/user.model');

const formatAddress = (a) => ({
  addressId: a._id,
  street: a.street,
  buildingName: a.buildingName,
  city: a.city,
  state: a.state,
  country: a.country,
  pincode: a.pincode,
});

// POST /api/addresses
const createAddress = async (req, res) => {
  try {
    const address = await Address.create({ ...req.body, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { $push: { addresses: address._id } });
    return res.status(201).json(formatAddress(address));
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach(k => { errors[k] = err.errors[k].message; });
      return res.status(400).json(errors);
    }
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/addresses
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    return res.status(200).json(addresses.map(formatAddress));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/addresses/:addressId
const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.addressId);
    if (!address) return res.status(404).json({ message: `Address not found with AddressId:${req.params.addressId}`, status: false });
    return res.status(200).json(formatAddress(address));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/user/addresses
const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    return res.status(200).json(addresses.map(formatAddress));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/addresses/:addressId
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(
      req.params.addressId,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!address) return res.status(404).json({ message: `Address not found with addressId:${req.params.addressId}`, status: false });
    return res.status(200).json(formatAddress(address));
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach(k => { errors[k] = err.errors[k].message; });
      return res.status(400).json(errors);
    }
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/addresses/:addressId
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.addressId);
    if (!address) return res.status(404).json({ message: `Address not found with addressId:${req.params.addressId}`, status: false });
    await User.findByIdAndUpdate(address.user, { $pull: { addresses: address._id } });
    await address.deleteOne();
    return res.status(200).json(`Address Deleted successfully with addressId ${req.params.addressId}`);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createAddress, getAllAddresses, getAddressById, getUserAddresses, updateAddress, deleteAddress };
