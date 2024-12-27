// models/supplier.js
import { Schema, model } from 'mongoose';

const supplierSchema = new Schema({

name: {
    type: String,
    unique: true,
    required: true
  },
phonenumber:{
    type: Number,
    required:true,
    unique:true

  }, 
email: {
    type: String,
    unique: true,
    required: true
  }

}, { timestamps: true });

const Supplier = model('Supplier', supplierSchema);

export default Supplier;
