/**
 * LẨU NƯỚNG VN - PRODUCT ROUTES
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// Public routes (Khách hàng xem thực đơn)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected admin routes (Quản trị viên thao tác CRUD)
router.post('/', verifyToken, requireAdmin, productController.createProduct);
router.put('/:id', verifyToken, requireAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, requireAdmin, productController.deleteProduct);
router.patch('/:id/toggle-available', verifyToken, requireAdmin, productController.toggleAvailability);

module.exports = router;
