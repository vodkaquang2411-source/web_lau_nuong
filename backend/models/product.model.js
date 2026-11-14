/**
 * LẨU NƯỚNG VN - PRODUCT MODEL
 * Thực hiện các thao tác truy vấn CSDL cho bảng món ăn (Prepared Statements)
 */

const { pool } = require('../config/db');

class ProductModel {
  static async findAll({ category, search, isFeatured, isAvailable } = {}) {
    let sql = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      sql += ` AND c.slug = ?`;
      params.push(category);
    }

    if (search && search.trim() !== '') {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    if (isFeatured !== undefined) {
      sql += ` AND p.is_featured = ?`;
      params.push(isFeatured ? 1 : 0);
    }

    if (isAvailable !== undefined) {
      sql += ` AND p.is_available = ?`;
      params.push(isAvailable ? 1 : 0);
    }

    sql += ` ORDER BY p.id DESC`;

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async findById(id) {
    const sql = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ category_id, name, slug, description, price, image_url, is_featured, is_available }) {
    const sql = `
      INSERT INTO products (category_id, name, slug, description, price, image_url, is_featured, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      category_id || null,
      name,
      slug || '',
      description || '',
      price || 0,
      image_url,
      is_featured ? 1 : 0,
      is_available !== undefined ? (is_available ? 1 : 0) : 1
    ]);
    return result.insertId;
  }

  static async update(id, { category_id, name, slug, description, price, image_url, is_featured, is_available }) {
    const sql = `
      UPDATE products
      SET category_id = ?, name = ?, slug = ?, description = ?, price = ?, image_url = ?, is_featured = ?, is_available = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(sql, [
      category_id || null,
      name,
      slug || '',
      description || '',
      price || 0,
      image_url,
      is_featured ? 1 : 0,
      is_available !== undefined ? (is_available ? 1 : 0) : 1,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM products WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }

  static async toggleAvailable(id) {
    const sql = `UPDATE products SET is_available = NOT is_available WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ProductModel;
