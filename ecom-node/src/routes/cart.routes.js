const express = require('express');
const router = express.Router();
const {
  addProductToCart, createOrUpdateCart, getAllCarts,
  getUserCart, updateCartProduct, deleteProductFromCart,
} = require('../controllers/cart.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

router.post('/cart/create', verifyToken, createOrUpdateCart);
router.post('/carts/products/:productId/quantity/:quantity', verifyToken, addProductToCart);
router.get('/carts', verifyToken, hasRole('ROLE_ADMIN'), getAllCarts);
router.get('/carts/users/cart', verifyToken, getUserCart);
router.put('/cart/products/:productId/quantity/:operation', verifyToken, updateCartProduct);
router.delete('/carts/:cartId/product/:productId', verifyToken, deleteProductFromCart);

module.exports = router;
