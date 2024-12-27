// Import necessary modules from Mongoose
import { Schema, model } from 'mongoose';

// Create a new schema for the requested items
const PurchaseRequestSchema = new Schema({
  itemName: {
    type: String,
    required: [true, 'Please provide an item name'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide the quantity'],
    min: [1, 'Quantity must be at least 1'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requesterId:{
    type:String,
  }
}, { timestamps: true });

// Create a model based on the schema
const PurchaseRequest = model('PurchaseRequest', PurchaseRequestSchema);

// Export the model
export default PurchaseRequest;