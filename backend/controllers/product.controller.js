/**
 * LẨU NƯỚNG VN - PRODUCT CONTROLLER
 * Xử lý logic nghiệp vụ cho toàn bộ các API thực đơn món ăn (CRUD)
 */

const ProductModel = require('../models/product.model');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, isFeatured, isAvailable } = req.query;
    const products = await ProductModel.findAll({
      category,
      search,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
      isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy món ăn có mã ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { category_id, name, slug, description, price, image_url, is_featured, is_available } = req.body;

    if (!name || price === undefined || !image_url) {
      return res.status(400).json({
        success: false,
        message: 'Tên món ăn, giá bán và hình ảnh là bắt buộc.'
      });
    }

    const newId = await ProductModel.create({
      category_id,
      name,
      slug: slug || name.toLowerCase().replace(/ /g, '-'),
      description,
      price,
      image_url,
      is_featured,
      is_available
    });

    res.status(201).json({
      success: true,
      message: 'Thêm món ăn mới vào thực đơn thành công!',
      data: { id: newId, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ProductModel.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Món ăn có mã ID ${id} không tồn tại.`
      });
    }

    await ProductModel.update(id, req.body);

    res.json({
      success: true,
      message: 'Cập nhật thông tin món ăn thành công!',
      data: { id, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy món ăn ID ${id} để xóa.`
      });
    }

    res.json({
      success: true,
      message: `Đã xóa món ăn ID ${id} khỏi thực đơn.`
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const toggled = await ProductModel.toggleAvailable(id);

    if (!toggled) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy món ăn ID ${id}.`
      });
    }

    res.json({
      success: true,
      message: 'Đã thay đổi trạng thái phục vụ món ăn thành công!'
    });
  } catch (error) {
    next(error);
  }
};
