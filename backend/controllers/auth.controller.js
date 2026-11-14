/**
 * LẨU NƯỚNG VN - AUTH CONTROLLER
 * Xử lý logic Đăng nhập, Đăng ký và Mã hóa mật khẩu bảo mật (Bcrypt + JWT)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'launuongvn_jwt_secret_super_secure_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ email và mật khẩu.'
      });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    if (user.status === 'locked') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ tổng đài 1900 8888.'
      });
    }

    // So sánh mật khẩu bằng bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền họ tên, email và mật khẩu.'
      });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được đăng ký tài khoản trong hệ thống.'
      });
    }

    // Mã hóa mật khẩu một chiều bằng bcrypt salt rounds = 10
    const passwordHash = await bcrypt.hash(password, 10);

    const newUserId = await UserModel.create({
      full_name: fullName,
      email,
      phone,
      password_hash: passwordHash,
      role: 'customer'
    });

    const token = jwt.sign(
      { id: newUserId, email, role: 'customer', fullName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      token,
      user: {
        id: newUserId,
        fullName,
        email,
        phone,
        role: 'customer'
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin người dùng.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
