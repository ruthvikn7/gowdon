import express from 'express';
import {
  getAllDeliveries,
  createDelivery,
  deleteDeliveryById,
  updateDeliveryById,
  getDeliveryById
  // Add other controller functions as needed
} from "../../controllers/PurchasingDepartment/DeliveryController.js"
import {auth} from '../../services/authService.js'
import {authorize} from '../../services/authorizeUser.js'

const router = express.Router();

// Define Delivery routes
router.get('/', getAllDeliveries);
router.post('/', createDelivery);
router.get('/:id', getDeliveryById);
router.put('/:id', updateDeliveryById);
router.delete('/:id', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), deleteDeliveryById);

// Add other routes as needed

export default router;
