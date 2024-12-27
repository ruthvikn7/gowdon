import express from 'express';
import {
  getSupplierById,
  getAllSuppliers,
  createSupplier,
  deleteSupplierById,updateSupplierById
  // Add other controller functions as needed
} from '../../controllers/PurchasingDepartment/SupplierController.js'
import {auth} from '../../services/authService.js'
import {authorize} from '../../services/authorizeUser.js'


const router = express.Router();


// Get a supplier by ID
router.get('/:id', getSupplierById);

router.get('/', getAllSuppliers);
router.post('/', createSupplier);
router.put('/:id', updateSupplierById);

router.delete('/:id',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), deleteSupplierById);
export default router;
