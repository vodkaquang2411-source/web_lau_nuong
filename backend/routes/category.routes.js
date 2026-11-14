/**
 * LẨU NƯỚNG VN - CATEGORY ROUTES
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', categoryController.getAllCategories);

// Protected admin routes (CRUD)
router.post('/', verifyToken, requireAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, requireAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;
