const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analytics.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/admin/app/analytics:
 *   get:
 *     tags: [Analytics]
 *     summary: Get analytics data (Admin only)
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get('/admin/app/analytics', verifyToken, hasRole('ROLE_ADMIN'), getAnalytics);

module.exports = router;
