// cpuDataSchema.js
import mongoose from 'mongoose';

const categoryWiseCountschema = new mongoose.Schema({

 name:{type:String, required:true, unique:true},
 count: {type : Number, default : 0,required:true}
},{timestamps:true});



const CategoryWiseCount = mongoose.model('CategoryWiseCount', categoryWiseCountschema);

export default CategoryWiseCount;
