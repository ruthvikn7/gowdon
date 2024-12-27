// inspectionRoutes.js
import express from 'express';
import {
  getAllInspections,
  getInspectionById,
  getInspectionByItemId,
  createInspection,
  updateInspectionById,
  deleteInspectionById,
 
} from '../controllers/inspectionController.js';
import { auth } from '../services/authService.js';
import { authorize } from '../services/authorizeUser.js';

const router = express.Router();

// GET all inspections
router.get('/inspections', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getAllInspections);

// GET inspection by ID
router.get('/inspections/:inspectionId', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getInspectionById);

// GET inspections by Item ID
router.get('/inspections/item/:itemId', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getInspectionByItemId);

// POST create a new inspection
router.post('/inspections', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), createInspection);

// PUT update inspection by ID
router.put('/inspections/:inspectionId', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), updateInspectionById);

// DELETE inspection by ID
router.delete('/inspection/:itemId', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), deleteInspectionById);


export default router;
