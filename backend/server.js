/**
 * LẨU NƯỚNG VN - SERVER ENTRY POINT
 * Slogan: "Hương vị Việt – Trọn vị sum vầy"
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { checkDatabaseConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  // 1. Kiểm tra kết nối CSDL MySQL
  await checkDatabaseConnection();

  // 2. Khởi chạy máy chủ HTTP
  app.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`  NHÀ HÀNG LẨU NƯỚNG VN - MÁY CHỦ WEB & RESTful API BACKEND`);
    console.log(`  "Hương vị Việt – Trọn vị sum vầy"`);
    console.log(`=============================================================`);
    console.log(`  🌐 Website người dùng:  http://localhost:${PORT}`);
    console.log(`  🛠  Trang quản trị:     http://localhost:${PORT}/admin/index.html`);
    console.log(`  🚀 API Health Check:    http://localhost:${PORT}/api/health`);
    console.log(`  📑 API Thực đơn:        http://localhost:${PORT}/api/products`);
    console.log(`=============================================================`);
    console.log(`  Nhấn CTRL + C trong Terminal để dừng máy chủ.\n`);
  });
}

startServer();
