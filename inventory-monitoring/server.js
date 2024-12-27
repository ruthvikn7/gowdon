// server.js
import express from 'express';
import multer from 'multer';
import { connectToDatabase } from './config/db.js';
import cpuRoutes from './routes/cpuRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import purchaseItemRoutes from  './routes/purchaseItemRoutes.js';
import damagedItemRoutes from './routes/damagedItemRoutes.js'
import inspectionStatusRoutes from './routes/inspectionStatusRoutes.js'
import supplierRoutes from './routes/PurchasingDepartment/SupplierRoutes.js'
import categoryRoutes from './routes/PurchasingDepartment/CategoryRoutes.js'
import item1Routes from './routes/PurchasingDepartment/ItemRoutes.js'
import deliveryRoutes from './routes/PurchasingDepartment/DeliveryRoutes.js';
import deliveryItemRoutes from './routes/PurchasingDepartment/DeliveryItemRoutes.js';
import evaluator from './routes/PurchasingDepartment/EvaluatorRoutes.js';
import UploadexcelRoute from './routes/UploadexcelRoute.js';
import DocumentsRoutes from './routes/DocumentsRoutes.js';
import cors from 'cors';

import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 7050;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.use(express.json());
app.use(
  cors({

    origin: ["http://localhost:5173", "http://192.168.30.12","http://localhost:5000","http://192.168.30.45","htt://192.168.30.81"],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  })
);
  
// Connect to the database
connectToDatabase();

// Use the CPU routes
app.use('/api/v1/cpu-performance', cpuRoutes);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/purchase', purchaseItemRoutes);
app.use('/api/v1/damagedItems', damagedItemRoutes);
app.use('/api/v1/inspection-status', inspectionStatusRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/purchaseDepartment/items', item1Routes);
app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/deliveryItems', deliveryItemRoutes);
app.use('/api/v1/evaluators',evaluator)
app.use("/api/v1/upload", upload.single("file"),UploadexcelRoute)
app.use("/api/v1/documents",DocumentsRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// //const storage = multer.memoryStorage();//////image
// const upload = multer({ storage });/////image
// app.use(upload.any());//////image