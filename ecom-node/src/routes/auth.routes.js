const { upload } = require('../utils/file.utils');
const express = require('express');
const router = express.Router();
const { signin, signup, getCurrentUsername, getUserDetails, signout, getAllSellers,uploadProfilePicture } = require('../controllers/auth.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: Bad credentials
 */
router.post('/signin', signin);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 */
router.post('/signup', signup);
router.get('/username', verifyToken, getCurrentUsername);
router.get('/user', verifyToken, getUserDetails);
router.post('/signout', signout);
router.get('/sellers', verifyToken, hasRole('ROLE_ADMIN'), getAllSellers);
router.put('/profile-picture', verifyToken, upload.single('image'), uploadProfilePicture);

module.exports = router;
