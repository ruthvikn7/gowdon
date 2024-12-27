import xlsx from 'xlsx';
import Item from '../Model/itemSchema.js';


const transformAndValidateData = (data) => {
  return data.map(itemData => {
    // Convert delivery_date from Excel serial to Date object if necessary
    if (itemData.delivery_date && typeof itemData.delivery_date === 'number') {
      const excelDate = itemData.delivery_date;
      const jsDate = new Date(Math.round((excelDate - 25569) * 86400 * 1000)); // Excel date to JS date
      itemData.delivery_date = jsDate;
    } else if (itemData.delivery_date) {
      itemData.delivery_date = new Date(itemData.delivery_date); // If it is already a string or date-like
    }

    // Set default values if not provided
    itemData.damagedItems = itemData.damagedItems || 0;
    itemData.warrantydetails = itemData.warrantydetails || "warranty details not found";
    itemData.unusedItems = itemData.unusedItems || 0;
    itemData.unusedMonth = itemData.unusedMonth || 0;

    // Convert supplier and category to arrays of objects
    if (itemData.supplier) { 
      itemData.supplier = itemData.supplier.split(",").map(name => ({ name: name.trim() }));
    }
    if (itemData.category) {
      itemData.category = itemData.category.split(",").map(name => ({ name: name.trim() }));
    }

    return itemData;
  });
};

export const uploadExcel = async (req, res) => {
//  console.log(req.file,"request")
 try {
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Check if the required columns are present
  const requiredColumns = [
    "itemId", "name", "description", "unit", "quantity", "price",
    "delivery_date", "damagedItems",
    "unusedItems", "unusedMonth", "supplier", "category", "brand"
  ];

  const columns = Object.keys(data[0]);
  const missingColumns = requiredColumns.filter(col => !columns.includes(col));

  if (missingColumns.length > 0) {
    return res.status(400).json({ error: `Missing required columns: ${missingColumns.join(", ")}` });
  }

  const transformedData = transformAndValidateData(data);

  // Validate and save each item
  for (const itemData of transformedData) {
    try {
      const item = new Item(itemData);
      await item.save();
    } catch (validationError) {
      console.error("Validation Error:", validationError);
      return res.status(400).json({ error: `Validation error for item: ${itemData.name}`, details: validationError.message });
    }
  }

  res.status(200).json({ message: "Data uploaded and saved successfully" });
} catch (err) {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
}
};




// import xlsx from 'xlsx';
// import Item from '../Model/itemSchema.js';


// const transformAndValidateData = (data) => {
//   return data.map(itemData => {
//     // Transform delivery_date to Date object
//     if (itemData.delivery_date) {
//       itemData.delivery_date = new Date(itemData.delivery_date);
//     }

//     // Set default values if not provided
//     itemData.damagedItems = itemData.damagedItems || 0;
//     itemData.warrantydetails = itemData.warrantydetails || "warranty details not found";
//     itemData.unusedItems = itemData.unusedItems || 0;
//     itemData.unusedMonth = itemData.unusedMonth || 0;

//     // Convert supplier and category to arrays of objects
//     if (itemData.supplier) { 
//       itemData.supplier = itemData.supplier.split(",").map(name => ({ name: name.trim() }));
//     }
//     if (itemData.category) {
//       itemData.category = itemData.category.split(",").map(name => ({ name: name.trim() }));
//     }

//     return itemData;
//   });
// };

// export const uploadExcel = async (req, res) => {
// //  console.log(req.file,"request")
//  try {
//   const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//   const sheet = workbook.Sheets[workbook.SheetNames[0]];
//   const data = xlsx.utils.sheet_to_json(sheet);

//   // Check if the required columns are present
//   const requiredColumns = [
//     "itemId", "name", "description", "unit", "quantity", "price",
//     "delivery_date", "damagedItems",
//     "unusedItems", "unusedMonth", "supplier", "category", "brand"
//   ];

//   const columns = Object.keys(data[0]);
//   const missingColumns = requiredColumns.filter(col => !columns.includes(col));

//   if (missingColumns.length > 0) {
//     return res.status(400).json({ error: `Missing required columns: ${missingColumns.join(", ")}` });
//   }

//   const transformedData = transformAndValidateData(data);

//   // Validate and save each item
//   for (const itemData of transformedData) {
//     try {
//       const item = new Item(itemData);
//       await item.save();
//     } catch (validationError) {
//       console.error("Validation Error:", validationError);
//       return res.status(400).json({ error: `Validation error for item: ${itemData.name}`, details: validationError.message });
//     }
//   }

//   res.status(200).json({ message: "Data uploaded and saved successfully" });
// } catch (err) {
//   console.error("Server Error:", err);
//   res.status(500).json({ error: "Internal Server Error" });
// }
// };
