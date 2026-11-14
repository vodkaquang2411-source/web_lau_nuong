/**
 * LẨU NƯỚNG VN - DATABASE CONNECTION POOL
 * Quản lý kết nối MySQL qua mysql2/promise với kết nối Pool tự phục hồi
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'launuongvn',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// Khởi tạo Connection Pool
const pool = mysql.createPool(dbConfig);

// Kiểm tra và khởi tạo database nếu cần
async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[MySQL] Kết nối thành công đến CSDL "${dbConfig.database}" trên cổng ${dbConfig.port}!`);
    connection.release();
    return true;
  } catch (error) {
    console.warn(`\n[MySQL CẢNH BÁO] Chưa thể kết nối đến MySQL CSDL: ${error.message}`);
    console.warn(`-> Hướng dẫn: Bạn vui lòng mở phần mềm XAMPP Control Panel và bấm "Start" tại mục MySQL.`);
    console.warn(`-> Cổng mặc định: 3306, Tài khoản: root, Mật khẩu: (để trống).\n`);
    return false;
  }
}

module.exports = {
  pool,
  checkDatabaseConnection
};
