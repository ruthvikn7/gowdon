//purchaseItemRoutes.js
import express from 'express';
import { createPurchaseRequest, getAllPurchaseRequests,deletePurchaseRequestById,updatePurchaseRequestById,getPurchaseRequestById,getTotalRequestedItems } from '../controllers/purchaseItemController.js';
import {auth} from '../services/authService.js'
import {authorize} from '../services/authorizeUser.js'
const router = express.Router();

// Define routes for purchase requests
router.post('/purchase-requests', createPurchaseRequest);
router.get('/purchase-requests', getAllPurchaseRequests);
router.get('/purchase-requests/:id', getPurchaseRequestById);
router.get('/totalpurchase-requests', getTotalRequestedItems);
router.delete('/purchase-requests/:id', deletePurchaseRequestById);
router.patch('/purchase-requests/:id', updatePurchaseRequestById);
router.patch('/purchase-request/:id', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]),updatePurchaseRequestById);//for status approval


export default router;