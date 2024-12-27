import { Schema, model } from "mongoose";
import { createCanvas } from 'canvas';

const itemSchema = new Schema({
  itemId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a name for this product"],
    trim: true,
    lowercase: true,
    minLength: [3, "Name must be at least 3 characters"],
    // maxLength: [20]
  },
  ProductID:{type:String,
  },
  description: {
    type: String,
    required: true,
  },
  InvoiceNo: {
    type: String,
    // required: true,
  },
  unit: {
    type: String,
    required: true,
      enum: {
        values: ["kg", "litre", "pcs", "bag"],
        message: "Unit value can't be {value}. Must be kg/litre/pcs/bag"
      }
  },
  quantity:{
    type: Number,
    required: true,
  },
  price:{
    type: Number,
    required: true
  },
  image: {
    type: Buffer,
  },
  delivery_date: {
    type: Date,
    required: true
  },
  damagedItems: {
    type: Number,
    default: 0,
  },
  warranty:{
    type: Buffer,
  },
  unusedItems: {
    type: Number,
    default: 0,
  },
  unusedMonth: {
    type: Number,
    default: 0, 
  },
  supplier: [{
    name: { type: String, required: [true, 'Supplier name is required'] },
  }],
  category: [{
    name: {
      type: String,
      required:true
    },
  }],
  brand: {
      type: String,
      required: true
  },
  bill:{
    type: Buffer,
  },
},{timestamps: true});

// Pre-save middleware to generate image based on item name using Canvas..
itemSchema.pre('save', async function (next) {
  try {
    // Check if the image buffer is already present
    if (!this.image) {
      // If the image buffer is not present, generate it based on item name using Canvas
      const canvas = createCanvas(200, 100); // Set the canvas size
      const context = canvas.getContext('2d');

      // Draw something on the canvas (customize this based on your requirements)
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#000000';
      context.font = '10px Arial';
      context.fillText(`please Add ${this.name}'s image`, 10, 50);

      // Convert the canvas to a Buffer
      const buffer = canvas.toBuffer();

      // Set the image buffer
      this.image = buffer;
    }

    // Generate the itemId if not present
    if (!this.itemId) {
      // Find the last item in the collection to determine the next ID
      const lastItem = await this.constructor.findOne().sort({ createdAt: -1 });

      let newIdNumber;
      if (lastItem && lastItem.itemId) {
        const lastIdNumber = parseInt(lastItem.itemId.slice(3), 10);
        newIdNumber = lastIdNumber + 1;
      } else {
        newIdNumber = 1; // Start the sequence from 1 if no items found
      }

      this.itemId = `pro${newIdNumber.toString().padStart(3, '0')}`;
    }

    // Continue with the save operation
    next();
  } catch (error) {
    console.error('Error during image generation or ID creation:', error);
    next(error); // Pass the error to the next middleware or callback
  }
});

const Item = model('item', itemSchema);

export default Item;
