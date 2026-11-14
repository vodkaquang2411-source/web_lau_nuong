/**
 * LẨU NƯỚNG VN - STATS & DASHBOARD CONTROLLER
 * Cung cấp tổng hợp số liệu cho trang Admin Dashboard
 */

const { pool } = require('../config/db');

exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. Tổng số món ăn
    const [[{ total_products }]] = await pool.query('SELECT COUNT(*) AS total_products FROM products');

    // 2. Tổng số danh mục
    const [[{ total_categories }]] = await pool.query('SELECT COUNT(*) AS total_categories FROM categories');

    // 3. Đặt bàn: Tổng, chờ duyệt, đã xác nhận
    const [[reservationStats]] = await pool.query(`
      SELECT 
        COUNT(*) AS total_reservations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_reservations,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_reservations,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_reservations
      FROM reservations
    `);

    // 4. Tổng khách hàng
    const [[{ total_customers }]] = await pool.query("SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'");

    res.json({
      success: true,
      data: {
        totalProducts: total_products || 0,
        totalCategories: total_categories || 0,
        totalReservations: reservationStats.total_reservations || 0,
        pendingReservations: reservationStats.pending_reservations || 0,
        confirmedReservations: reservationStats.confirmed_reservations || 0,
        completedReservations: reservationStats.completed_reservations || 0,
        totalCustomers: total_customers || 0,
        estimatedRevenue: (reservationStats.completed_reservations || 0) * 850000 // Doanh thu ước tính 850k/bàn
      }
    });
  } catch (error) {
    next(error);
  }
};
