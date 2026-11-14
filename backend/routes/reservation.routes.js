/**
 * LẨU NƯỚNG VN - RESERVATION ROUTES
 */

const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// Public route: Khách đặt bàn
router.post('/', reservationController.createReservation);

// Protected admin routes: Quản lý và duyệt lịch hẹn (CRUD)
router.get('/', verifyToken, requireAdmin, reservationController.getAllReservations);
router.get('/:id', verifyToken, requireAdmin, reservationController.getReservationById);
router.patch('/:id/status', verifyToken, requireAdmin, reservationController.updateReservationStatus);
router.delete('/:id', verifyToken, requireAdmin, reservationController.deleteReservation);

module.exports = router;
