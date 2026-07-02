const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, deleteCategory, updateCategory } = require('../controllers/category.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/public/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 50 }
 *       - in: query
 *         name: SortBy
 *         schema: { type: string, default: categoryName }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, default: asc }
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/public/categories', getAllCategories);

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [CategoryName]
 *             properties:
 *               CategoryName:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/admin/categories', verifyToken, hasRole('ROLE_ADMIN', 'ROLE_SELLER'), createCategory);

/**
 * @swagger
 * /api/admin/categories/{categoryId}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category (Admin)
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted
 *   put:
 *     tags: [Categories]
 *     summary: Update a category (Admin)
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CategoryName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 */
router.delete('/admin/categories/:categoryId', verifyToken, hasRole('ROLE_ADMIN'), deleteCategory);
router.put('/admin/categories/:categoryId', verifyToken, hasRole('ROLE_ADMIN', 'ROLE_SELLER'), updateCategory);

module.exports = router;
