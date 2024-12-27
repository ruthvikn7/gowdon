// models/delivery.js
import { Schema, model } from 'mongoose';

const deliverySchema = new Schema({
  supplier_id: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  item_id: {
    type: Schema.Types.ObjectId,
    ref: 'Purchasing-Department-Item',
    required: true
  },
  delivery_date: {
    type: Date,
    required: true
  },
  overall_rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  overall_rating_reason: String
  // Other relevant delivery information
}, { timestamps: true });

// Remove unique index before deletion
deliverySchema.index({ supplier_id: 1, item_id: 1, delivery_date: 1 }, { unique: false });

// Compound index with unique filter
deliverySchema.index({ supplier_id: 1, item_id: 1 }, { unique: true, partialFilterExpression: { item_id: { $exists: true } } });

// Recreate unique index after deletion
deliverySchema.index({ supplier_id: 1, item_id: 1, delivery_date: 1 }, { unique: true });

const Delivery = model('Delivery', deliverySchema);

export default Delivery;
