/**
 * LẨU NƯỚNG VN - CATEGORY MODEL
 * Thao tác dữ liệu bảng danh mục (Prepared Statements)
 */

const { pool } = require('../config/db');

class CategoryModel {
  static async findAll() {
    const sql = `
      SELECT c.*, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.id ASC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  }

  static async findById(id) {
    const sql = `SELECT * FROM categories WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ name, slug, description, sort_order, is_active }) {
    const sql = `
      INSERT INTO categories (name, slug, description, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      name,
      slug,
      description || '',
      sort_order || 1,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);
    return result.insertId;
  }

  static async update(id, { name, slug, description, sort_order, is_active }) {
    const sql = `
      UPDATE categories
      SET name = ?, slug = ?, description = ?, sort_order = ?, is_active = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(sql, [
      name,
      slug,
      description || '',
      sort_order || 1,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM categories WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = CategoryModel;
