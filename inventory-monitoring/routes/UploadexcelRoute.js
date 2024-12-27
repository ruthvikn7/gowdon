import express from 'express';
import { uploadExcel } from '../controllers/Uploadexcel.js'; // Correct import

const router = express.Router();

router.post('/excel', uploadExcel);

export default router;
