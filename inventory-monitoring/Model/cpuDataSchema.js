//cpuDataSchema.js
import mongoose from 'mongoose';

const dailyPerformanceSchema = new mongoose.Schema({
  lastRunDate: {
    type: Date,
    required: true,
    unique:true,
  },
  ramUsageInPercentage: {
    type: Number,
    required: true,
  },
  cpuPerformanceRank: {
    type: String,
    enum: ['Underuse', 'Good Use', 'Perfectly Used', 'Super Computer', 'Danger'],
  },
}, { timestamps: true });

const cpuDataSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    required: true,
  },
  dailyPerformance: [dailyPerformanceSchema],
  motherboard: {
    manufacturer: String,
    model: String,
    version: String,
    serial: String,
    assetTag: String,
    memMax: Number,
    memSlots: Number,
  },
}, { timestamps: true });

const CPUData = mongoose.model('CPUData', cpuDataSchema);

export default CPUData;
