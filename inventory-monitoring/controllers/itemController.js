//Itemcontroller.jsx
// Import the Item model
import Item from '../Model/itemSchema.js';
// import CategoryWiseCount from '../Model/categorySchema.js';



/**
 * tags:
 *   name: Items
 *   description: API endpoints for managing items
 */

/**
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: Description of the item
 *         unit:
 *           type: string
 *           description: Unit of measurement for the item
 *         quantity:
 *           type: number
 *           description: Quantity of the item available
 *         price:
 *           type: number
 *           description: Price of the item
 *         supplier:
 *           type: string
 *           description: Supplier of the item
 *         category:
 *           type: string
 *           description: Category of the item
 *         brand:
 *           type: string
 *           description: Brand of the item
 *         damagedItems:
 *           type: number
 *           description: Number of damaged items
 *         unusedItems:
 *           type: number
 *           description: Number of unused items
 *         image:
 *           type: string
 *           format: binary
 *           description: Image of the item (binary data)
 */

/**
 * /items:
 *   get:
 *     summary: Get all items
 *     description: Retrieves all items.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter items by name or description
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Internal server error
 */



export const getAllItems = async (req, res) => {
  try {
    // Extract the search term and date range from the query parameters
    const { search, startDate, endDate } = req.query;

    // Build a regex pattern for case-insensitive search
    const searchPattern = search ? new RegExp(search, 'i') : null;

    // Build the query object
    const query = {};

    // Add search pattern for text fields
    if (searchPattern) {
      query.$or = [
        { name: searchPattern },
        { description: searchPattern },
      ];
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.delivery_date = {};
      if (startDate) {
        query.delivery_date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.delivery_date.$lte = new Date(endDate);
      }
    }

    // Retrieve items based on the query
    const items = await Item.find(query);
    const transformedItems = items.map(item => {
      item.quantity = parseInt(item.quantity, 10);
      return item;
    });

    res.status(200).json(transformedItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// export const getAllItems = async (req, res) => {
//   try {
//     // Extract the search term from the query parameter
//     const { search } = req.query;

//     // Build a regex pattern for case-insensitive search
//     const searchPattern = new RegExp(search, 'i');

//     // Use the search pattern in the query to filter items
//     const query = search ? { $or: [{ name: searchPattern }, { description: searchPattern },] } : {};

//     // Retrieve items based on the search query
//     const items = await Item.find(query);
//     const transformedItems = items.map(item => {
//       item.quantity = parseInt(item.quantity, 10);
//       return item;
//     });

//     res.status(200).json(items);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



/**
 * /items:
 *   post:
 *     summary: Create a new item
 *     description: Creates a new item with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Successfully created a new item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
export const createNewItem = async (req, res) => {
  try {
    const {
      name, description, unit, quantity, price, delivery_date, supplier, category, brand,
      damagedItems, unusedItems, warrantydetails, servicedetails
    } = req.body;

    // Parse supplier and category if they are received as strings
    const parsedSupplier = typeof supplier === 'string' ? JSON.parse(supplier) : supplier;
    const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;

    // Check if image and bill files are uploaded
    let imageBuffer = null;
    let billBuffer = null;
    let warrantyBuffer =null;

    if (req.files) {
      if (req.files.image) {
        imageBuffer = req.files.image[0].buffer;
      }
      if (req.files.bill) {
        billBuffer = req.files.bill[0].buffer;
      }
      if (req.files.warranty){
        warrantyBuffer = req.files.warranty[0].buffer;
      }
    }

    // Create a new item
    const newItem = new Item({
      name,
      description,
      unit,
      quantity,
      price,
      delivery_date,
      warrantydetails,
      servicedetails,
      supplier: parsedSupplier,
      category: parsedCategory,
      brand,
      damagedItems: damagedItems || 0,
      unusedItems: unusedItems || 0,
      image: imageBuffer,
      bill: billBuffer,
      warranty: warrantyBuffer,
    });

    // Save the new item to the database
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};





// export const createMultipleItems = async (req, res) => {
//   try {
//     const { products } = req.body; // Expecting an array of product objects
//     console.log("products:",products)

//     if (!Array.isArray(products)) {
//       return res.status(400).json({ error: 'Products should be an array.' });
//     }

//     const createdItems = [];

//     for (const product of products) {
//       const {
//         name, description, unit, quantity, price, delivery_date, supplier, category, brand,
//         damagedItems, unusedItems, warrantydetails, servicedetails, InvoiceNo,ProductID,
//       } = product;

//       const parsedSupplier = typeof supplier === 'string' ? JSON.parse(supplier) : supplier;
//       const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;

//       let imageBuffer = null;
//       let billBuffer = null;
//       let warrantyBuffer = null;

//       if (req.files && req.files[product.name]) { 
//         const filesForProduct = req.files[product.name];

//         if (filesForProduct.image) {
//           imageBuffer = filesForProduct.image[0].buffer;
//         }
//         if (filesForProduct.bill) {

          
//           billBuffer = filesForProduct.bill[0].buffer;
//         }
//         if (filesForProduct.warranty) {
//           warrantyBuffer = filesForProduct.warranty[0].buffer;
//         }
//       }

//       // Create a new item for each product
//       const newItem = new Item({
//         name,
//         description,
//         unit,
//         quantity,
//         price,
//         delivery_date,
//         warrantydetails,
//         servicedetails,
//         InvoiceNo,
//         ProductID,
//         supplier: parsedSupplier,
//         category: parsedCategory,
//         brand,
//         damagedItems: damagedItems || 0,
//         unusedItems: unusedItems || 0,
//         image: imageBuffer,
//         bill: billBuffer,
//         warranty: warrantyBuffer,
//       });

//       // Save the new item to the database
//       const savedItem = await newItem.save();
//       createdItems.push(savedItem);
//     }

//     // Return all created items as a response
//     res.status(200).json({message:"Success"});
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// };



export const createMultipleItems = async (req, res) => {
  try {
    const { products } = req.body;
    console.log(req.body)

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products should be an array.' });
    }

    const createdItems = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      try {
        const product = products[i];
        const {
          name, description, unit, quantity, price, delivery_date, supplier, category, brand,
          damagedItems, unusedItems, warrantydetails, servicedetails, InvoiceNo, ProductID,
        } = product;

        const requiredFields = ['name', 'unit', 'quantity', 'price', 'supplier', 'category'];
        for (const field of requiredFields) {
          if (!product[field]) {
            throw new Error(`${field} is required for product at index ${i}`);
          }
        }

        const numericFields = ['quantity', 'price', 'damagedItems', 'unusedItems'];
        for (const field of numericFields) {
          if (product[field] && isNaN(Number(product[field]))) {
            throw new Error(`${field} must be a number for product at index ${i}`);
          }
        }

        const parsedSupplier = typeof supplier === 'string' ? JSON.parse(supplier) : supplier;
        const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;

        

        let imageBuffer = null;
        let billBuffer = null;
        let warrantyBuffer = null;

        if (req.files && req.files[product.name]) {
          const filesForProduct = req.files[product.name];
          if (filesForProduct.image) {
            imageBuffer = filesForProduct.image[0].buffer;
          }
          if (filesForProduct.bill) {
            billBuffer = filesForProduct.bill[0].buffer;
          }
          if (filesForProduct.warranty) {
            warrantyBuffer = filesForProduct.warranty[0].buffer;
          }
        }

        const newItem = new Item({
          name,
          description,
          unit,
          quantity: Number(quantity),
          price: Number(price),
          delivery_date,
          warrantydetails,
          servicedetails,
          InvoiceNo,
          ProductID,
          supplier: parsedSupplier,
          category: parsedCategory,
          brand,
          damagedItems: Number(damagedItems) || 0,
          unusedItems: Number(unusedItems) || 0,
          image: imageBuffer,
          bill: billBuffer,
          warranty: warrantyBuffer,
        });

        const savedItem = await newItem.save();
        createdItems.push(savedItem);
      } catch (error) {
        errors.push(`Error processing product at index ${i}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Some products could not be processed",
        errors: errors,
        createdItems: createdItems
      });
    }

    res.status(200).json({ message: "All products successfully created", createdItems: createdItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An unexpected error occurred while processing the request" });
  }
};



// dummy 
// export const createNewItem = async (req, res) => {
//   console.log(req.body, "request");
//   try {
//     // Extract item details from the request body
//     const { name, description, unit, quantity, price, supplier, category, brand, damagedItems, unusedItems } = req.body;

//     // Parse JSON strings into arrays
//     const parsedCategory = JSON.parse(category);
//     const parsedSupplier = JSON.parse(supplier);

//     // Check if an image file is uploaded
//     let imageBuffer;
//     if (req.files && req.files.length > 0) {
//       // Assuming only one file is uploaded, you can access it as req.files[0]
//       imageBuffer = req.files[0].buffer;
//     }

//     // Create a new item
//     const newItem = new Item({
//       name,
//       description,
//       unit,
//       quantity,
//       price,
//       supplier: parsedSupplier,
//       category: parsedCategory,
//       brand,
//       damagedItems: damagedItems || 0, // Set default value for new field
//       unusedItems: unusedItems || 0, // Set default value for new field
//       image: imageBuffer, // Set the image buffer
//     });

//     // Save the new item to the database
//     const savedItem = await newItem.save();

//     res.status(201).json(savedItem);
//   } catch (error) {
//     // console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// };


/**
 * /items/category/{category}:
 *   get:
 *     summary: Get items by category with quantity aggregation
 *     description: Retrieves items belonging to a specific category with quantity aggregation.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter items by name or description (optional)
 *     responses:
 *       200:
 *         description: Successfully retrieved items by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: number
 *                     description: Number of items in the category
 *                   totalQuantity:
 *                     type: number
 *                     description: Total quantity of items in the category
 *                   items:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Item'
 *       404:
 *         description: No items found in the specified category
 *       500:
 *         description: Internal server error
 */


export const categoryWiseItems = async (req, res) => {
  // console.log(req.body);
  // console.log(req.params);
  // console.log(req.query);
  try {
    const { category } = req.params;
    const { search } = req.query;

    // Build a regex pattern for case-insensitive search
    const searchPattern = new RegExp(search, 'i');

    // Use MongoDB aggregation to filter items by category and sum up the quantities
    const result = await Item.aggregate([
      {
        $match: {
          $and: [
            { 'category.name': category },
            {
              $or: [
                { name: { $regex: searchPattern } },
                { description: { $regex: searchPattern } },
              ],
            },
          ],
        },
      },
      {
        $addFields: {
          // Convert quantity to integer
          quantity: { $toInt: "$quantity" }
        }
      },
      {
        $group: {
          _id: '$_id',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }, // Sum up the quantities
          items: { $push: '$$ROOT' },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: `No items found in the '${category}' category.` });
    } else {
      // Transform the result to include total quantity and detailed information about each item
      const transformedResult = result.map((group) => ({
        count: group.count,
        totalQuantity: group.totalQuantity,
        items: group.items.map((item) => ({
          _id: item._id,
          name: item.name,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          price: item.price,
          supplier: item.supplier,
          category: item.category,
          brand: item.brand,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      }));

      return res.status(200).json(transformedResult);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// export const categoryWiseItems = async (req, res) => {
//   console.log(req.body)
//   console.log(req.params)
//   console.log(req.query)
//   try {
//     const { category } = req.params;
//     const { search } = req.query;

//     // Build a regex pattern for case-insensitive search
//     const searchPattern = new RegExp(search, 'i');
    
    
//     // Use MongoDB aggregation to filter items by category and sum up the quantities
//     const result = await Item.aggregate([
//       {
//         $match: {
//           $and: [
//             { 'category.name': category },
//             {
//               $or: [
//                 { name: { $regex: searchPattern } },
//                 { description: { $regex: searchPattern } },
//               ],
//             },
//           ],
//         },
//       },
//       {
//         $group: {
//           _id: '$_id',
//           count: { $sum: 1 },
//           totalQuantity: { $sum: '$quantity' }, // Sum up the quantities
//           items: { $push: '$$ROOT' },
//         },
//       },
//     ]);

//     const items = await Item.find({
//       'category.name': category,
//       $or: [
//         { name: { $regex: searchPattern } },
//         { description: { $regex: searchPattern } },
//       ],
//     });
  

//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: `No items found in the '${category}' category.` });
//     } else {
//       // Transform the result to include total quantity and detailed information about each item
//       const transformedResult = result.map((group) => ({
//         count: group.count,
//         totalQuantity: group.totalQuantity,
//         items: group.items.map((item) => ({
//           _id: item._id,
//           name: item.name,
//           description: item.description,
//           unit: item.unit,
//           quantity: item.quantity,
//           price: item.price,
//           supplier: item.supplier,
//           category: item.category,
//           brand: item.brand,
//           createdAt: item.createdAt,
//           updatedAt: item.updatedAt,
//         })),
//       }));

//       return res.status(200).json(transformedResult);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

/**
 * /items/category/{category}/search:
 *   get:
 *     summary: Get items by category with search
 *     description: Retrieves items belonging to a specific category with optional search by name or description.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter items by name or description (optional)
 *     responses:
 *       200:
 *         description: Successfully retrieved items by category with search
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Internal server error
 */





export const getAllItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { search } = req.query;

    // Build a regex pattern for case-insensitive search
    const searchPattern = new RegExp(search, 'i');

    // Query items with the specified category name and optional search
    const query = {
      'category.name': category,
      $or: [
        { name: { $regex: searchPattern } },
        { description: { $regex: searchPattern } },
      ],
    };

    // Retrieve items based on the query
    const items = await Item.find(query);
    
    const transformedItems = items.map(item => {
      item.quantity = parseInt(item.quantity, 10);
      return item;
    });
    // Send the items as a JSON response
    res.status(200).json(transformedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * /items/category/count:
 *   get:
 *     summary: Get category-wise item count
 *     description: Retrieves the count of items grouped by category.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter categories by name (optional)
 *     responses:
 *       200:
 *         description: Successfully retrieved category-wise item count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the success of the operation
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Category ID
 *                       name:
 *                         type: string
 *                         description: Category name
 *                       count:
 *                         type: integer
 *                         description: Number of items in the category
 *       500:
 *         description: Internal server error
 */
export const getCategoryWiseCount = async (req, res) => {
  try {
    const { search } = req.query;

    // Build a regex pattern for case-insensitive search
    const searchPattern = new RegExp(search, 'i');

    // Use MongoDB aggregation to group items by category and count the unique occurrences
    const result = await Item.aggregate([
      { $unwind: '$category' },
      {
        $match: {
          'category.name': searchPattern, // Modify this line to include searchPattern
        },
      },
      {
        $group: {
          _id: '$category.name',
          uniqueId: { $addToSet: '$_id' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Transform the result to add uniqueId to each document
    const transformedResult = result.map((item) => ({
      _id: item.uniqueId[0], // Assuming you want the first _id from the set as the uniqueId
      name: item._id,
      count: item.count,
    }));

    res.status(200).json({ message: 'Successfully fetched the data', result: transformedResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



export const findItemByID = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Delete the item from the database
    const foundItem = await Item.findById(itemId);

    if (!foundItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    foundItem.quantity = parseInt(foundItem.quantity, 10);

    res.status(200).json({ message: 'success', item: foundItem });
  } catch (error) {
    // console.error(error);
    res.status(500).json({error: error.message });
  }
};




/**
 * /items/{itemId}:
 *   put:
 *     summary: Update an item by ID
 *     description: Updates an existing item with the provided ID.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Successfully updated the item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad request, invalid input data
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
export const updateItem = async (req, res) => {
  // console.log(req.body)
  try {
    const itemId = req.params.itemId; 
    const { name, description, unit, quantity, price, supplier, category, brand, damagedItems, unusedItems } = req.body;

    // Update the item in the database
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        $set: {
          name,
          description,
          unit,
          quantity,
          price,
          supplier,
          category,
          brand,
          damagedItems: damagedItems || 0, // Set default value for new field
          unusedItems: unusedItems || 0, // Set default value for new field
        },
      },
      { new: true }
    );
    // console.log(req.body,"hello");
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * /items/{itemId}:
 *   patch:
 *     summary: Update specific fields of an item by ID
 *     description: Updates specific fields of an existing item with the provided ID.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               damagedItems:
 *                 type: number
 *                 description: Number of damaged items
 *               unusedItems:
 *                 type: number
 *                 description: Number of unused items
 *               unusedMonth:
 *                 type: number
 *                 description: Number of unused months
 *     responses:
 *       200:
 *         description: Successfully updated the specified fields of the item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
export const updateItemFields = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { damagedItems, unusedItems, unusedMonth } = req.body;

    // Update only the specified fields in the database
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        $set: {
          damagedItems: damagedItems || 0,
          unusedItems: unusedItems || 0,
          unusedMonth: unusedMonth || 0,
        },
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



/**
 * /items/{itemId}:
 *   delete:
 *     summary: Delete an item by ID
 *     description: Deletes an existing item with the provided ID.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Delete the item from the database
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: error.message });
  }
};



/**
 * /items/{itemId}/image:
 *   put:
 *     summary: Upload image for an item
 *     description: Uploads an image for the specified item.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
export const uploadImage = async(req, res)=>{
  // console.log(req,"hello")
  try{
    const { buffer } = req.file;
    // const itemId = req.params.itemId;
    const updatedImage = await Item.findOneAndUpdate(
      { _id: req.params.itemId },
      {image: buffer},
      {new: true})

      if(updatedImage){
        res.status(200).json(updatedImage)
      }
  }
  catch(err){
    console.log("there is an error",err)
    return res.status(500).json({message: err.message})
  }
}

export const uploadBill = async(req, res)=>{
  // console.log(req,"hello")
  try {
    const { buffer } = req.file;
    const { itemId } = req.params;

    const updatedBill = await Item.findOneAndUpdate(
      { _id: itemId },
      { bill: buffer },
      { new: true }
    );

    if (updatedBill) {
      res.status(200).json(updatedBill);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error('There is an error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const uploadWarranty = async(req, res)=>{
  // console.log(req,"hello")
  try {
    const { buffer } = req.file;
    const { itemId } = req.params;

    const updatedWarranty = await Item.findOneAndUpdate(
      { _id: itemId },
      { warranty: buffer },
      { new: true }
    );

    if (updatedWarranty) {
      res.status(200).json(updatedWarranty);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error('There is an error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * /items/{itemId}/image:
 *   get:
 *     summary: Get image for an item
 *     description: Retrieves the image for the specified item.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item
 *     responses:
 *       200:
 *         description: Image data
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Item or image not found
 *       500:
 *         description: Internal server error
 */
export const getImage = async(req, res)=>{
  try{
    const itemId = req.params.itemId;

    // Delete the item from the database
    const itemData = await Item.findById(itemId);
      if (!itemData) {
        console.log("error")
        return res.status(404).send('item not found');
      }
      if (!itemData.image) {
        return res.status(404).send('Image not found for this employee');
      }
      // Set the appropriate content type for the image
      res.setHeader('Content-Type', 'image/jpeg'); // Adjust according to your image type
  
      // Send the image data as a binary response
      res.send(itemData.image);
  }
  catch(error){
    return res.status(500).json({error: error.message})
  }
}

// export const getAllItemswithoutimage = async (req, res) => {
//   try {
//     // Extract the search term from the query parameter
//     const { search } = req.query||"";


//     const searchPattern = new RegExp(search, 'i');


//     const query = search ? { $or: [{ name: searchPattern },{_id}{ itemId: searchPattern }] } : {};

    
//     const items = await Item.find(query).select('-image -warranty -bill');

//     res.status(200).json(items);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types; // Importing ObjectId correctly

export const getAllItemswithoutimage = async (req, res) => {
  try {
    // Extract the search term from the query parameter
    let { search } = req.query;
    
    // Check if search is provided and not empty
    const query = {};
    if (search) {
      // Try to convert search to ObjectId (if it's a valid ObjectId)
      if (ObjectId.isValid(search)) {
        query._id = new mongoose.Types.ObjectId(search); // Correct usage of ObjectId
      } else {
        // Fallback to string match for other fields
        const searchPattern = new RegExp(search, 'i');
        query.$or = [
          { name: searchPattern },
          { itemId: searchPattern }
        ];
      }
    }

    const items = await Item.find(query).select('-image -warranty -bill');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getTotalItemsCount = async (req, res) => {
  try {
    const totalItems = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: { $toInt: "$quantity" } }
        }
      }
    ]);

    if (totalItems.length > 0) {
      res.status(200).json({ totalQuantity: totalItems[0].totalQuantity });
    } else {
      res.status(200).json({ totalQuantity: 0 });
    }
  } catch (error) {
    console.error('Error calculating total items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTotalUnusedItemsCount = async (req, res) => {
  try {
    const totalItems = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalUnused: { $sum: { $toInt: "$unusedItems" } }
        }
      }
    ]);

    if (totalItems.length > 0) {
      res.status(200).json({ totalUnused: totalItems[0].totalUnused });
    } else {
      res.status(200).json({ totalUnused: 0 });
    }
  } catch (error) {
    console.error('Error calculating total items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOneItemforAccounts = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findOne({ itemId });

    if (!item) {
      return res.status(404).json({data:{}, message: 'Item not found' });
    }

    res.json({data:item});
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






// Controller function for aggregating and grouping items
export const aggregateItems = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    // Aggregation pipeline
    const aggregationPipeline = [
      {
        $unwind: '$supplier' // Unwind supplier array to process each supplier separately
      },
      {
        $unwind: '$category' // Unwind category array to process each category separately
      },
      {
        $match: searchQuery
          ? { 'supplier.name': { $regex: searchQuery, $options: 'i' } } // Case-insensitive search
          : {}
      },
      {
        $group: {
          _id: {
            supplierName: '$supplier.name', // Group by supplier name
            categoryName: '$category.name' // Include category name
          },
          totalPurchasePrice: { $sum: '$price' } // Sum up the prices in each category for each supplier
        }
      },
      {
        $project: {
          _id: 0,
          supplierName: '$_id.supplierName',
          categoryName: '$_id.categoryName', // Project category name
          totalPurchasePrice: 1
        }
      }
    ];

    // Execute the aggregation pipeline
    const results = await Item.aggregate(aggregationPipeline);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error aggregating items:', error);
    res.status(500).json({ error: 'An error occurred while aggregating items' });
  }
};



// Controller to get all bills and warranties
export const getBillsAndWarranties = async (req, res) => {
  try {
    const { query = '', startDate, endDate } = req.query;

    // Construct the date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Determine if date filter should be applied
    const dateFilterCondition = startDate || endDate ? { delivery_date: dateFilter } : {};

    // Fetch all items that match the query and optionally the date filter
    const items = await Item.find({
      $and: [
        {
          $or: [
            { bill: { $ne: null } },
            { warranty: { $ne: null } }
          ]
        },
        dateFilterCondition,
        { name: new RegExp(query, 'i') }  // Case-insensitive search
      ]
    }).select('bill warranty name delivery_date');

    // Handle cases where no items are found
    if (!items || items.length === 0) {
      return res.json({ bills: [], warranties: [] });
    }

    const bills = items
      .filter(item => item.bill)
      .map(item => ({
        name: item.name,
        bill: `data:application/pdf;base64,${item.bill.toString('base64')}`,
        delivery_date: item.delivery_date
      }));

    const warranties = items
      .filter(item => item.warranty)
      .map(item => ({
        name: item.name,
        warranty: `data:application/pdf;base64,${item.warranty.toString('base64')}`,
        delivery_date: item.delivery_date
      }));

    res.json({ bills, warranties });
  } catch (error) {
    console.error('Error fetching bills and warranties:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






let productCounter = 1; 
const generateProductId = () => {
  const productId = `Qprod-${productCounter.toString().padStart(4, '0')}`;
  productCounter += 1;
  return productId;
};

export const processInvoice = async (reqBody) => {
  try {
    console.log('Received request body:', reqBody.body);

    if (!reqBody || !reqBody.products || !Array.isArray(reqBody.products)) {
      throw new Error('Invalid request body or missing products array');
    }

    reqBody.products = reqBody.products.map((product, index) => {
      product['Product-ID'] = generateProductId(index);
      return product;
    });

    const apiPayload = {
      "InvoiceNo": reqBody.InvoiceNo,
      "SubTotal": reqBody.SubTotal,
      "IGST": reqBody.IGST,
      "SGST": reqBody.SGST,
      "CGST": reqBody.CGST,
      "Date": reqBody.Date,
      "Description": reqBody.Description,
      "TotalAmount": reqBody.TotalAmount,
      "products": reqBody.products,
    };

    const response1 = await axios.post('http://localhost:7050/api/v1/items/createMultipleItems', apiPayload);
    console.log('Response from first API:', response1.data);

    // Hit the second API
    // const response2 = await axios.post('http://192.168.30.81:5000/api/accounts/outflow/other-outflows', apiPayload);
    // console.log('Response from second API:', response2.data);

  } catch (error) {
    console.error('Error processing invoice:', error.message);
  }
};



