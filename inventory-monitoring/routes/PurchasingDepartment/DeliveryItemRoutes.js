import express from 'express';
import {
  getAllDeliveryItems,
  createDeliveryItem,
  getAllRatings,
  getDeliveryItemById,
  updateDeliveryItemById,
  deleteDeliveryItemById
  // Add other controller functions as needed
} from '../../controllers/PurchasingDepartment/DeliveryItemController.js';
import {auth} from '../../services/authService.js'
import {authorize} from '../../services/authorizeUser.js'

const router = express.Router();
// Define DeliveryItem routes..
router.get('/',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getAllDeliveryItems);
router.post('/',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), createDeliveryItem);
router.get('/:id', getDeliveryItemById);
router.put('/:id', updateDeliveryItemById);
router.delete('/:id',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), deleteDeliveryItemById);
router.get("/all/ratings", getAllRatings)
// router.get('/individual-ratings/:id', getAllRatings); 

export default router;
