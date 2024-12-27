//itemRoutes.js
import express from 'express';
import multer from 'multer';
import {auth} from '../services/authService.js'
import {authorize} from '../services/authorizeUser.js'
import { getAllItems, createNewItem,createMultipleItems,processInvoice,categoryWiseItems,getAllItemsByCategory,getCategoryWiseCount,updateItem,deleteItem,findItemByID,uploadImage,getImage,updateItemFields,getAllItemswithoutimage, uploadBill,uploadWarranty,getTotalItemsCount,getTotalUnusedItemsCount,getOneItemforAccounts,aggregateItems,getBillsAndWarranties} from '../controllers/itemController.js';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

const logRequest = (req, res, next) => {
    console.log('first from the accounts ');
    next(); 
  };

  
router.get('/', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]),getAllItems);
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'bill', maxCount: 1 },{ name: 'warranty', maxCount: 1 }]), createNewItem); 
router.post('/createMultipleItems', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'bill', maxCount: 1 },{ name: 'warranty', maxCount: 1 }]),logRequest,createMultipleItems); 
router.get('/category', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getCategoryWiseCount);
router.get('/:category', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]),categoryWiseItems)
router.get('/category/:category', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), getAllItemsByCategory);
router.get('/items/:itemId', findItemByID); 
router.put('/items/:itemId', updateItem);  
router.delete('/:itemId', auth, authorize(["ROLE_SUPER_ADMIN","ROLE_ADMIN"]), deleteItem);    
router.put("/upload/:itemId" , upload.single('image'), uploadImage)
router.put("/billupdate/:itemId" , upload.single('bill'), uploadBill)
router.put("/warrantyupdate/:itemId" , upload.single('warranty'), uploadWarranty)
router.get("/getimage/:itemId", getImage)
router.patch('/updateItems/:itemId', updateItemFields);
// router.get('/categorywise', getCategoryWiseCount);
router.get('/item/accounts', getAllItemswithoutimage);
router.get('/item/count',getTotalItemsCount);
router.get('/unused/count',getTotalUnusedItemsCount);
router.get('/item/accounts/:itemId',getOneItemforAccounts);


router.get('/aggregate-items/vendor', aggregateItems);

router.get('/bills-and-warranties/download', getBillsAndWarranties);



router.post('/processInvoice',processInvoice)

export default router;
    