import express from 'express';
import multer from 'multer';
import {CreateDocuments,getAllDocuments,deleteDocument,addEmployeeAccess,removeEmployeeAccess,getEmployeeAccess} from '../controllers/documentController.js';
import { auth } from '../services/authService.js';
import { authorize } from '../services/authorizeUser.js';
import {checkEmployeeAccess} from '../services/documentAuth.js';
// import {handleFileUploads} from '../controllers/dummyController.js';
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Set file size limit to 50 MB
});

const router = express.Router();

router.post('/',auth, authorize(["ROLE_SUPER_ADMIN"]), upload.single('document'), CreateDocuments);
// router.post('/dummy',auth, authorize(["ROLE_SUPER_ADMIN"]), handleFileUploads);
router.get('/',checkEmployeeAccess,getAllDocuments);
router.delete('/:itemId',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]),deleteDocument);
router.post('/documents/add-employee-access',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), addEmployeeAccess);
router.post('/documents/remove-employee-access',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), removeEmployeeAccess);
router.get('/documents/:documentId/employee-access',auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getEmployeeAccess);


export default router;    
