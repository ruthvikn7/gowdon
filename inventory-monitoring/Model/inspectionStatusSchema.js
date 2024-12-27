// inspectionStatusSchema.js
import { Schema, model } from 'mongoose';

const inspectionSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'damagedItem',
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  inspectionDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'under Inspection', 'completed'],
    default: 'pending',
    required: true,
  },
  otherDetails: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Inspection = model('Inspection', inspectionSchema);

export default Inspection;
