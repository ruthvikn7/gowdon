// models/File.js

import File from '../Model/dummydocumentSchema.js';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';


// Create storage engine using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return cb(err);
      }
      cb(null, buf.toString('hex') + path.extname(file.originalname));
    });
  }
});
// Initialize multer upload
const upload = multer({ storage }).single('file');

// Handle file upload
export const handleFileUploads = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: 'File upload error' });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { filename, contentType, size } = req.file;

      // Create a new file record in MongoDB
      const newFile = new File({
        filename,
        contentType,
        size,
        // Optionally, you can store additional metadata
        metadata: req.body.metadata  // Assuming metadata is sent in the request body
      });

      await newFile.save();

      res.json({ file: newFile });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
};

export async function CreateDocument(req, res) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: 'File upload error' });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { folderName, rackNumber, user } = req.body;
      const { filename } = req.file;

      const document = new Document({
        folderName,
        uploadedFile: filename, // Store the filename from GridFS
        rackNumber,
        user,
      });

      await document.save();
      res.status(201).json({ success: true, data: document });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}
