/**
 * LẨU NƯỚNG VN - RESERVATION MODEL
 * Thao tác dữ liệu bảng đặt bàn (Prepared Statements)
 */

const { pool } = require('../config/db');

class ReservationModel {
  static async findAll({ status, search } = {}) {
    let sql = `
      SELECT r.*, b.name AS branch_name, b.address AS branch_address
      FROM reservations r
      JOIN branches b ON r.branch_id = b.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      sql += ` AND r.status = ?`;
      params.push(status);
    }

    if (search && search.trim() !== '') {
      sql += ` AND (r.customer_name LIKE ? OR r.customer_phone LIKE ? OR r.code LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY r.id DESC`;

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async findById(id) {
    const sql = `
      SELECT r.*, b.name AS branch_name, b.address AS branch_address
      FROM reservations r
      JOIN branches b ON r.branch_id = b.id
      WHERE r.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async findByCode(code) {
    const sql = `
      SELECT r.*, b.name AS branch_name, b.address AS branch_address
      FROM reservations r
      JOIN branches b ON r.branch_id = b.id
      WHERE r.code = ?
    `;
    const [rows] = await pool.query(sql, [code]);
    return rows[0] || null;
  }

  static async create({ code, branch_id, user_id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, guest_count, note }) {
    const sql = `
      INSERT INTO reservations (code, branch_id, user_id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, guest_count, note, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    const [result] = await pool.query(sql, [
      code,
      branch_id,
      user_id || null,
      customer_name,
      customer_phone,
      customer_email,
      reservation_date,
      reservation_time,
      guest_count || 2,
      note || ''
    ]);
    return result.insertId;
  }

  static async updateStatus(id, status) {
    const sql = `UPDATE reservations SET status = ? WHERE id = ?`;
    const [result] = await pool.query(sql, [status, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM reservations WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }

  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) AS total_reservations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_reservations,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_reservations,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_reservations,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_reservations
      FROM reservations
    `;
    const [rows] = await pool.query(sql);
    return rows[0] || {};
  }
}

module.exports = ReservationModel;
