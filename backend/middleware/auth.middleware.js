/**
 * LẨU NƯỚNG VN - AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 * Xác thực JSON Web Token (JWT) và Phân quyền Quản trị viên (Admin Role)
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'launuongvn_jwt_secret_super_secure_key_2026';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-access-token'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy mã xác thực phiên đăng nhập (Token). Vui lòng đăng nhập lại!'
    });
  }

  // Token format: "Bearer <token>" hoặc "<token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc mã token không hợp lệ.',
      error: err.message
    });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền thực hiện thao tác này. Yêu cầu quyền Quản trị viên (Admin).'
    });
  }
  next();
}

module.exports = {
  verifyToken,
  requireAdmin
};
