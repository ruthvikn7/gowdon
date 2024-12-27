// models/EvaluatorSchema.js
import { Schema, model } from 'mongoose';

const evaluatorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const Evaluator = model('Evaluator', evaluatorSchema);

export default Evaluator;
