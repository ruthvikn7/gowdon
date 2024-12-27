// models/item.js
import { Schema, model } from 'mongoose';

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: String,
  // Other relevant item information
}, { timestamps: true });

const Item = model('Purchasing-Department-Item', itemSchema);

export default Item;
