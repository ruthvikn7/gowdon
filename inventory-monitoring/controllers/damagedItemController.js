//damagedItemController.js
import DamagedItem from '../Model/damagedItemSchema.js'; 
import Inspection from '../Model/inspectionStatusSchema.js';

/**
 * tags:
 *   name: Damaged Items
 *   description: API endpoints for managing damaged items
 */

/**
 * components:
 *   schemas:
 *     DamagedItem:
 *       type: object
 *       properties:
 *         itemName:
 *           type: string
 *           description: The name of the damaged item
 *         damageDescription:
 *           type: string
 *           description: Description of the damage
 */

/**
 * /damaged-items:
 *   post:
 *     summary: Create a new damaged item
 *     description: Creates a new damaged item with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DamagedItem'
 *     responses:
 *       201:
 *         description: Successfully created a new damaged item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DamagedItem'
 *       500:
 *         description: Internal server error
 */

export async function createItem(req, res) {
  try {
    const { itemName, damageDescription, supplierName, supplierEmail, supplierPhoneNumber } = req.body;
    let warrantyBuffer = null;
    if (req.file) { // Check if file is uploaded
      warrantyBuffer = req.file.buffer; // Access file buffer
    }

    const newItem = new DamagedItem({
      itemName,
      damageDescription,
      supplier: {
        name: supplierName,
        email: supplierEmail,
        phoneNumber: supplierPhoneNumber,
      },
      warranty: warrantyBuffer,
    });

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


/**
 * /damaged-items:
 *   get:
 *     summary: Get all damaged items
 *     description: Retrieves all damaged items.
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term to filter damaged items by itemName
 *     responses:
 *       200:
 *         description: A list of damaged items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DamagedItem'
 *       500:
 *         description: Internal server error
 */

export async function getAllItems(req, res) {
  try {
    const searchTerm = req.query.searchTerm || '';  
    const query = {
      itemName: { $regex: new RegExp(searchTerm, 'i') }  
    };

    const allItems = await DamagedItem.find(query);
    res.status(200).json(allItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




// export async function getAllItems(req, res) {
//   try {
//     const searchTerm = req.query.searchTerm || '';
//     let query = {};
//     if (searchTerm) {
//       query = { itemName: searchTerm };
//     }
//     const allItems = await DamagedItem.find(query);
//     res.status(200).json(allItems);
//     console.log(allItems, "allItems");
//   } catch (error) {
//     console.error('Error fetching items:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

/**
 * /damaged-items/{itemId}:
 *   get:
 *     summary: Get a damaged item by ID
 *     description: Retrieves a damaged item by its ID.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the damaged item to retrieve
 *     responses:
 *       200:
 *         description: Damaged item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DamagedItem'
 *       404:
 *         description: Damaged item not found
 *       500:
 *         description: Internal server error
 */
export async function getItemById(req, res) {
  try {
    const item = await DamagedItem.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * /damaged-items/{itemId}:
 *   put:
 *     summary: Update a damaged item by ID
 *     description: Updates a damaged item with the provided details.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the damaged item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DamagedItem'
 *     responses:
 *       200:
 *         description: Successfully updated the damaged item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DamagedItem'
 *       404:
 *         description: Damaged item not found
 *       500:
 *         description: Internal server error
 */
export async function updateItemById(req, res) {
  try {
    // const { itemName, damageDescription, inspectionStatus} = req.body;
    const updatedItem = await DamagedItem.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}





// export async function updateItemById(req, res) {//ruthvik
//   try {
//     console.log(req.body)
//     const { itemName, damageDescription } = req.body;
//     const damagedItem = await DamagedItem.findById(req.params.itemId);
//     if (!damagedItem) {
//       return res.status(404).json({ error: 'Item not found' });
//     }
//     const inspection = await Inspection.findOne({itemId:req.params.itemId});
//     console.log(inspection, "Hello")
//     const inspectionStatus = inspection ? inspection.status : 'pending'; 
//     console.log(inspectionStatus,"status")
//     const updateData = {
//       itemName,
//       damageDescription,
//       inspectionStatus, 
//     };
//     console.log(updateData,"update")
//     const updatedItem = await DamagedItem.findByIdAndUpdate(
//       req.params.itemId,
//       updateData,
//       { new: true }
//     );
    
//     res.status(200).json(updatedItem);
//   } catch (error) {
//     console.error(error); 
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

/**
 * /damaged-items/{itemId}:
 *   delete:
 *     summary: Delete a damaged item by ID
 *     description: Deletes a damaged item by its ID.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the damaged item to delete
 *     responses:
 *       200:
 *         description: Damaged item deleted successfully
 *       404:
 *         description: Damaged item not found
 *       500:
 *         description: Internal server error
 */
export async function deleteItemById(req, res) {
  try {
    const deletedItem = await DamagedItem.findByIdAndDelete(req.params.itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
