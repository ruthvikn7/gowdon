import express from 'express';
import {
  getAllItems,
  createItem,
  getItemById,
  deleteItemById,
  updateItemById
  // Add other controller functions as needed
} from '../../controllers/PurchasingDepartment/ItemController.js'
import {auth} from '../../services/authService.js'
import {authorize} from '../../services/authorizeUser.js'


const router = express.Router();

// Define Item routes
router.get('/', getAllItems);
router.post('/', createItem);

router.get('/:id', getItemById);

router.put('/:id', updateItemById);
router.delete('/:id', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), deleteItemById);
export default router;
