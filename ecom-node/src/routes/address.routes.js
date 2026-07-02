const express = require('express');
const router = express.Router();
const {
  createAddress, getAllAddresses, getAddressById,
  getUserAddresses, updateAddress, deleteAddress,
} = require('../controllers/address.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Address management
 */

router.post('/addresses', verifyToken, createAddress);
router.get('/addresses', verifyToken, getAllAddresses);
router.get('/addresses/:addressId', verifyToken, getAddressById);
router.get('/user/addresses', verifyToken, getUserAddresses);
router.put('/addresses/:addressId', verifyToken, updateAddress);
router.delete('/addresses/:addressId', verifyToken, deleteAddress);

module.exports = router;
