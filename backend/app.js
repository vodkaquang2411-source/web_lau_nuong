/**
 * LẨU NƯỚNG VN - EXPRESS APPLICATION CONFIGURATION
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./routes/api');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// Middlewares cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ các file tĩnh của Frontend trực tiếp từ máy chủ Express
// Giúp bạn chỉ cần chạy `npm start` là mở được toàn bộ website trên trình duyệt!
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Phục vụ thư mục ảnh tải lên
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Đăng ký RESTful API Routes
app.use('/api', apiRouter);

// Điều hướng trang chủ mặc định về index.html nếu không khớp API
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Middleware xử lý lỗi tập trung
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
