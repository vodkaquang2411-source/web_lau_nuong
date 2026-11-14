/**
 * LẨU NƯỚNG VN - CENTRALIZED ERROR HANDLER MIDDLEWARE
 * Bắt và chuẩn hóa toàn bộ lỗi ngoại lệ trong ứng dụng Express
 */

function errorHandler(err, req, res, next) {
  console.error('[Error Details]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Đã xảy ra lỗi máy chủ nội bộ.';

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

// 404 Route Not Found
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Đường dẫn API không tồn tại: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
