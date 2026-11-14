/**
 * LẨU NƯỚNG VN - BRANCH ROUTES
 */

const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// Public route: Khách xem danh sách chi nhánh
router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);

// Protected admin routes: Thêm/Sửa/Xóa chi nhánh
router.post('/', verifyToken, requireAdmin, branchController.createBranch);
router.put('/:id', verifyToken, requireAdmin, branchController.updateBranch);
router.delete('/:id', verifyToken, requireAdmin, branchController.deleteBranch);

module.exports = router;
