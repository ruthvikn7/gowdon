// routes/EvaluatorRoutes.js
import express from 'express';
import {
  getAllEvaluators,
  createEvaluator,
  getEvaluatorById,
  deleteEvaluatorById,
} from '../../controllers/PurchasingDepartment/EvaluatorController.js';
import {auth} from '../../services/authService.js'
import {authorize} from '../../services/authorizeUser.js'

const router = express.Router();

router.get('/', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getAllEvaluators);
router.post('/', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), createEvaluator);
router.get('/:id', getEvaluatorById);
router.delete('/:id',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), deleteEvaluatorById);

export default router;
