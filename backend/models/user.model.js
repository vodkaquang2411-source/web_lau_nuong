/**
 * LẨU NƯỚNG VN - USER MODEL
 * Thao tác dữ liệu bảng người dùng và khách hàng (Prepared Statements)
 */

const { pool } = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const [rows] = await pool.query(sql, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const sql = `SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ full_name, email, phone, password_hash, role = 'customer' }) {
    const sql = `
      INSERT INTO users (full_name, email, phone, password_hash, role, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `;
    const [result] = await pool.query(sql, [full_name, email, phone || null, password_hash, role]);
    return result.insertId;
  }

  static async findAll() {
    const sql = `
      SELECT u.id, u.full_name, u.email, u.phone, u.role, u.status, u.created_at,
             COUNT(r.id) AS booking_count
      FROM users u
      LEFT JOIN reservations r ON u.id = r.user_id
      GROUP BY u.id
      ORDER BY u.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  }

  static async toggleStatus(id) {
    const sql = `
      UPDATE users 
      SET status = CASE WHEN status = 'active' THEN 'locked' ELSE 'active' END 
      WHERE id = ? AND role != 'admin'
    `;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = UserModel;
