const express = require('express');
const router = express.Router();
const { placeOrder, getAllOrders, getAllSellerOrders, updateOrderStatus,stripePayment,
  createRazorpayOrder } = require('../controllers/order.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/order/users/payments/{paymentMethod}:
 *   post:
 *     tags: [Orders]
 *     summary: Place an order
 *     parameters:
 *       - in: path
 *         name: paymentMethod
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId: { type: string }
 *               pgName: { type: string }
 *               pgPaymentId: { type: string }
 *               pgStatus: { type: string }
 *               pgResponseMessage: { type: string }
 *     responses:
 *       201:
 *         description: Order placed successfully
 */
router.post('/order/users/payments/online', verifyToken, placeOrder);
router.post('/order/users/payments/:paymentMethod', verifyToken, placeOrder);

router.post('/order/stripe-client-secret', verifyToken, stripePayment);
router.post('/order/razorpay-order', verifyToken, createRazorpayOrder);
router.get('/admin/orders', verifyToken, hasRole('ROLE_ADMIN'), getAllOrders);
router.get('/seller/orders', verifyToken, hasRole('ROLE_SELLER', 'ROLE_ADMIN'), getAllSellerOrders);
router.put('/admin/orders/:orderId/status', verifyToken, hasRole('ROLE_ADMIN'), updateOrderStatus);
router.put('/seller/orders/:orderId/status', verifyToken, hasRole('ROLE_SELLER', 'ROLE_ADMIN'), updateOrderStatus);

module.exports = router;
