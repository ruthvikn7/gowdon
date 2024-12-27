// models/deliveryItem.js
import { Schema, model } from 'mongoose';

const deliveryItemSchema = new Schema({
  delivery_id: {
    type: Schema.Types.ObjectId,
    ref: 'Delivery',
    required: true
  },
  item_id: {
    type: Schema.Types.ObjectId,
    ref: 'Purchasing-Department-Item',
    required: true
  },
  supplier_id: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  price: Number,
  quantity: Number,
  individual_item_rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  individual_item_rating_reason: { type: String, required: true },
  evaluation_date: {
    type: Date,
    default: Date.now // Set default to null or a default date as needed
  },
  evaluator_id: {
    type: Schema.Types.ObjectId,
    ref: 'Evaluator',
    required: true,
  }
}, { timestamps: true });

// Remove unique index before deletion
deliveryItemSchema.index({ delivery_id: 1, evaluator_id: 1 }, { unique: true });

const DeliveryItem = model('DeliveryItem', deliveryItemSchema);

export default DeliveryItem;
