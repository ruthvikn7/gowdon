import { Schema, model } from 'mongoose';
import { type } from 'os';

const supplierSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
});

const damagedItemSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  damageDescription: {
    type: String,
    default: '',
  },
  condition: {
    type: String,
    enum: ['Normal', 'Critical'],
    default: 'Normal',
  },
  supplier: {
    type: supplierSchema,
    default:'No details added'
  },
  warranty:{
    type:Buffer
  },
}, { timestamps: true });

const DamagedItem = model('damagedItem', damagedItemSchema);

export default DamagedItem;
