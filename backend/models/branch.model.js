/**
 * LẨU NƯỚNG VN - BRANCH MODEL
 * Thao tác dữ liệu bảng chi nhánh nhà hàng (Prepared Statements)
 */

const { pool } = require('../config/db');

class BranchModel {
  static async findAll() {
    const sql = `SELECT * FROM branches ORDER BY id ASC`;
    const [rows] = await pool.query(sql);
    return rows;
  }

  static async findById(id) {
    const sql = `SELECT * FROM branches WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ name, address, phone, hours, city, image_url, is_active }) {
    const sql = `
      INSERT INTO branches (name, address, phone, hours, city, image_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      name,
      address,
      phone,
      hours || '10:00 - 23:00',
      city || 'hanoi',
      image_url || '',
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);
    return result.insertId;
  }

  static async update(id, { name, address, phone, hours, city, image_url, is_active }) {
    const sql = `
      UPDATE branches
      SET name = ?, address = ?, phone = ?, hours = ?, city = ?, image_url = ?, is_active = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(sql, [
      name,
      address,
      phone,
      hours || '10:00 - 23:00',
      city || 'hanoi',
      image_url || '',
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM branches WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = BranchModel;
