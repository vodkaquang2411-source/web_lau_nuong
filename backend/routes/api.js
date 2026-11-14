/**
 * LẨU NƯỚNG VN - CENTRAL RESTful API ROUTER
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const reservationRoutes = require('./reservation.routes');
const branchRoutes = require('./branch.routes');
const statsController = require('../controllers/stats.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    server: 'Lẩu Nướng VN Express Backend',
    timestamp: new Date().toISOString()
  });
});

// Feature Sub-Routers
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/reservations', reservationRoutes);
router.use('/branches', branchRoutes);

// Dashboard Statistics (Admin only)
router.get('/stats/dashboard', verifyToken, requireAdmin, statsController.getDashboardStats);

module.exports = router;
