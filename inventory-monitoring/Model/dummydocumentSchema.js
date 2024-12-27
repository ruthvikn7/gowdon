import { Schema, model } from 'mongoose';

// Define the file schema
const fileSchema = new Schema({
  filename: String,
  contentType: String,
  size: Number,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  metadata: Object  // Optional metadata
});

// Create a model based on the schema
const File = model('File', fileSchema);

export default File;
