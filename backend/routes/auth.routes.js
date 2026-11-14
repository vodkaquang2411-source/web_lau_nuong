/**
 * LẨU NƯỚNG VN - AUTH ROUTES
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
