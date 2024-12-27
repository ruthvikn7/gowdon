// damagedItemRoutes.js
import express from 'express';
import multer from 'multer';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById,
} from '../controllers/damagedItemController.js';
import { auth } from '../services/authService.js';
import { authorize } from '../services/authorizeUser.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Set file size limit to 50 MB
});


const router = express.Router();

// Create a new item
router.post('/', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), upload.single('warranty'), createItem);

// Get all items
router.get('/', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getAllItems);

// Get item by ID
router.get('/:itemId', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getItemById);

// Update item by ID
router.put('/:itemId', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), updateItemById);

// Delete item by ID
router.delete('/:itemId', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), deleteItemById);

export default router;
