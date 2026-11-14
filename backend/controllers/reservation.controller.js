/**
 * LẨU NƯỚNG VN - RESERVATION CONTROLLER
 * Xử lý tiếp nhận yêu cầu đặt bàn trực tuyến và quy trình duyệt lịch hẹn
 */

const ReservationModel = require('../models/reservation.model');

exports.getAllReservations = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const reservations = await ReservationModel.findAll({ status, search });
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

exports.getReservationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await ReservationModel.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn đặt bàn ID ${id}`
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

exports.createReservation = async (req, res, next) => {
  try {
    const { branch_id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, guest_count, note } = req.body;

    if (!branch_id || !customer_name || !customer_phone || !customer_email || !reservation_date || !reservation_time) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc (Chi nhánh, Tên, Điện thoại, Email, Ngày và Giờ đến).'
      });
    }

    // Kiểm tra không cho đặt ngày quá khứ
    const selectedDate = new Date(reservation_date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Ngày dùng bữa không thể là một ngày trong quá khứ.'
      });
    }

    // Sinh mã đặt bàn duy nhất LN-XXXX
    const randomCode = 'LN-' + Math.floor(1000 + Math.random() * 9000);
    const userId = req.user ? req.user.id : null;

    const newId = await ReservationModel.create({
      code: randomCode,
      branch_id,
      user_id: userId,
      customer_name,
      customer_phone,
      customer_email,
      reservation_date,
      reservation_time,
      guest_count: Number(guest_count) || 2,
      note
    });

    res.status(201).json({
      success: true,
      message: 'Đặt bàn trực tuyến thành công! Nhà hàng sẽ liên hệ xác nhận trong ít phút.',
      data: {
        id: newId,
        code: randomCode,
        customer_name,
        customer_phone,
        reservation_date,
        reservation_time,
        guest_count
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Phải là một trong các giá trị: ${validStatuses.join(', ')}`
      });
    }

    const updated = await ReservationModel.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn đặt bàn ID ${id}.`
      });
    }

    res.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn đặt bàn #${id} thành "${status}".`
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { branch_id, reservation_date, reservation_time, guest_count, note } = req.body;

    const existing = await ReservationModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn đặt bàn ID ${id}.`
      });
    }

    if (existing.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Đơn đặt bàn này đã được xử lý bởi quản trị viên, không thể chỉnh sửa.'
      });
    }

    if (reservation_date) {
      const selectedDate = new Date(reservation_date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return res.status(400).json({
          success: false,
          message: 'Ngày dùng bữa không thể là một ngày trong quá khứ.'
        });
      }
    }

    await ReservationModel.updateReservation(id, {
      branch_id: branch_id ? Number(branch_id) : undefined,
      reservation_date,
      reservation_time,
      guest_count: guest_count ? Number(guest_count) : undefined,
      note
    });

    const updated = await ReservationModel.findById(id);

    res.json({
      success: true,
      message: 'Cập nhật thông tin đặt bàn thành công.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ReservationModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy đơn đặt bàn ID ${id} để xóa.`
      });
    }

    res.json({
      success: true,
      message: `Đã xóa đơn đặt bàn ID ${id} thành công.`
    });
  } catch (error) {
    next(error);
  }
};
