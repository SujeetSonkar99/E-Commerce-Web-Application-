const express = require('express');
const router = express.Router();
const {
  addProduct, getAllProducts, getProductsByCategory, getProductsByKeyword,
  updateProduct, deleteProduct, updateProductImage,
  getAllProductsForAdmin, getAllProductsForSeller,
} = require('../controllers/product.controller');
const { verifyToken, hasRole } = require('../middleware/auth.middleware');
const { upload } = require('../utils/file.utils');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

// Public routes
router.get('/public/products', getAllProducts);
router.get('/public/categories/:categoryId/products', getProductsByCategory);
router.get('/public/products/keyword/:Keyword', getProductsByKeyword);

// Admin routes
router.post('/admin/categories/:categoryId/product', verifyToken, hasRole('ROLE_ADMIN', 'ROLE_SELLER'), addProduct);
router.get('/admin/products', verifyToken, hasRole('ROLE_ADMIN', 'ROLE_SELLER'), getAllProductsForAdmin);
router.put('/admin/products/:productId', verifyToken, hasRole('ROLE_ADMIN', 'ROLE_SELLER'), updateProduct);
router.delete('/admin/products/:productId', verifyToken, hasRole('ROLE_ADMIN', 'ROLE_SELLER'), deleteProduct);
router.put('/admin/products/:productId/image', verifyToken, hasRole('ROLE_ADMIN', 'ROLE_SELLER'),
 upload.single('image'),
  updateProductImage);

// Seller routes
router.post('/seller/categories/:categoryId/product', verifyToken, hasRole('ROLE_SELLER', 'ROLE_ADMIN'), addProduct);
router.get('/seller/products', verifyToken, hasRole('ROLE_SELLER', 'ROLE_ADMIN'), getAllProductsForSeller);
router.put('/seller/products/:productId', verifyToken, hasRole('ROLE_SELLER', 'ROLE_ADMIN'), updateProduct);
router.delete('/seller/products/:productId', verifyToken, hasRole('ROLE_SELLER', 'ROLE_ADMIN'), deleteProduct);
router.put('/seller/products/:productId/image', verifyToken, hasRole('ROLE_SELLER', 'ROLE_ADMIN'), upload.single('image'), updateProductImage);

module.exports = router;
