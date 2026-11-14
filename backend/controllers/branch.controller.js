/**
 * LẨU NƯỚNG VN - BRANCH CONTROLLER
 * Xử lý nghiệp vụ quản lý hệ thống chi nhánh nhà hàng (CRUD)
 */

const BranchModel = require('../models/branch.model');

exports.getAllBranches = async (req, res, next) => {
  try {
    const branches = await BranchModel.findAll();
    res.json({
      success: true,
      count: branches.length,
      data: branches
    });
  } catch (error) {
    next(error);
  }
};

exports.getBranchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branch = await BranchModel.findById(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy chi nhánh ID ${id}`
      });
    }

    res.json({
      success: true,
      data: branch
    });
  } catch (error) {
    next(error);
  }
};

exports.createBranch = async (req, res, next) => {
  try {
    const { name, address, phone, hours, city, image_url, is_active } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Tên chi nhánh, địa chỉ và số điện thoại là bắt buộc.'
      });
    }

    const newId = await BranchModel.create({
      name,
      address,
      phone,
      hours,
      city,
      image_url,
      is_active
    });

    res.status(201).json({
      success: true,
      message: 'Thêm chi nhánh mới thành công!',
      data: { id: newId, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await BranchModel.update(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy chi nhánh ID ${id} để cập nhật.`
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin chi nhánh thành công!',
      data: { id, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await BranchModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy chi nhánh ID ${id} để xóa.`
      });
    }

    res.json({
      success: true,
      message: `Đã xóa chi nhánh ID ${id} thành công.`
    });
  } catch (error) {
    next(error);
  }
};
