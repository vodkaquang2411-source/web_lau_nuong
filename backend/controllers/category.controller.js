/**
 * LẨU NƯỚNG VN - CATEGORY CONTROLLER
 * Xử lý nghiệp vụ quản lý nhóm danh mục món ăn (CRUD)
 */

const CategoryModel = require('../models/category.model');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.findAll();
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, sort_order, is_active } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục và mã slug là bắt buộc.'
      });
    }

    const newId = await CategoryModel.create({
      name,
      slug,
      description,
      sort_order,
      is_active
    });

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục mới thành công!',
      data: { id: newId, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await CategoryModel.update(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy danh mục ID ${id} để cập nhật.`
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công!',
      data: { id, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await CategoryModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy danh mục ID ${id} để xóa.`
      });
    }

    res.json({
      success: true,
      message: `Đã xóa danh mục ID ${id}.`
    });
  } catch (error) {
    next(error);
  }
};
