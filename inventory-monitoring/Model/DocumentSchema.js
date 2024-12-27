import { Schema, model } from 'mongoose';

const documentSchema = new Schema({
  folderName: {
    type: String,
    required: true,
    unique: true,
  },
  uploadedFile: {
    type: Buffer,
    required: true,
  },
  rackNumber: {
    type: String,
    required: true,
  },
  user:{
    type:String,
    required:true,
  },
  access: [
    {
      employeeId: {
        type: String,
      },
    },
  ],
});

const Documenuments = model('document', documentSchema);

export default Documenuments;
