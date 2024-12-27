import express from 'express';
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  deleteCategoryById,
  updateCategoryById
  // Add other controller functions as needed
} from '../../controllers/PurchasingDepartment/CategoryController.js';
import {auth} from '../../services/authService.js'
import {authorize} from '../../services/authorizeUser.js'

const router = express.Router();

// Get a category by ID
router.get('/:id', getCategoryById);
// Define Category routes
router.get('/', getAllCategories);
router.post('/', auth, authorize(["ROLE_SUPER_ADMIN"]), createCategory);

router.put('/:id', updateCategoryById);
router.delete('/:id', deleteCategoryById);
export default router;
