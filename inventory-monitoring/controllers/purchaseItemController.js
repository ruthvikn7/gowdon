// purchaseItemController.js
import PurchaseRequest from '../Model/purchaseRequestSchema.js';


/**
 * 
 * /purchaseRequests:
 *   post:
 *     summary: Create a new purchase request
 *     description: Add a new purchase request to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 description: The name of the item being requested.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the item being requested.
 *               description:
 *                 type: string
 *                 description: Description of the purchase request.
 *     responses:
 *       201:
 *         description: Purchase request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseRequest'
 *       400:
 *         description: Bad request, failed to create purchase request
 * 
 *   get:
 *     summary: Get all purchase requests
 *     description: Retrieve all purchase requests from the system.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter purchase requests by item name or description (optional)
 *     responses:
 *       200:
 *         description: Successfully retrieved purchase requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseRequest'
 *       500:
 *         description: Internal server error
 * 
 * /purchaseRequests/{id}:
 *   get:
 *     summary: Get a purchase request by ID
 *     description: Retrieve a purchase request by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the purchase request to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the purchase request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseRequest'
 *       404:
 *         description: Purchase request not found
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update a purchase request by ID
 *     description: Update an existing purchase request by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the purchase request to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseRequestUpdate'
 *     responses:
 *       200:
 *         description: Purchase request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseRequest'
 *       404:
 *         description: Purchase request not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a purchase request by ID
 *     description: Delete a purchase request by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the purchase request to delete.
 *     responses:
 *       200:
 *         description: Purchase request deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Purchase request not found
 *       500:
 *         description: Internal server error
 */
export const createPurchaseRequest = async (req, res) => {
  try {
    // Extract purchase request details from the request body
    const { itemName, quantity, description,requesterId } = req.body;

    // If status is not provided, set it to 'pending'
  

    // Create a new purchase request
    const newPurchaseRequest = new PurchaseRequest({
      itemName,
      quantity,
      description,
      requesterId,
    
    });

    // Save the new purchase request to the database
    const savedPurchaseRequest = await newPurchaseRequest.save();

    res.status(201).json(savedPurchaseRequest);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// GET method to retrieve all purchase requests
export const getAllPurchaseRequests = async (req, res) => {
  try {
    let query = {};

    // Check if there is a search term in the query parameters
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      // You can customize this to search specific fields
      query = {
        $or: [
          { itemName: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { requesterId: { $regex: searchRegex } },
        ],
      };
    }

    const purchaseRequests = await PurchaseRequest.find(query);
    res.status(200).json(purchaseRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getPurchaseRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the purchase request by ID
    const purchaseRequest = await PurchaseRequest.findById(id);

    if (!purchaseRequest) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }

    res.status(200).json(purchaseRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePurchaseRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the purchase request by ID
    const existingPurchaseRequest = await PurchaseRequest.findById(id);

    if (!existingPurchaseRequest) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }

    // Extract updated details from the request body
    const { itemName, quantity, description, status,requesterId } = req.body;

    // Update the purchase request fields
    existingPurchaseRequest.itemName = itemName || existingPurchaseRequest.itemName;
    existingPurchaseRequest.quantity = quantity || existingPurchaseRequest.quantity;
    existingPurchaseRequest.description = description || existingPurchaseRequest.description;
    existingPurchaseRequest.status = status || existingPurchaseRequest.status;
    existingPurchaseRequest.requesterId = requesterId || existingPurchaseRequest.requesterId;

    // Save the updated purchase request to the database
    const updatedPurchaseRequest = await existingPurchaseRequest.save();

    res.status(200).json(updatedPurchaseRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE method to delete a purchase request by ID
export const deletePurchaseRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and remove the purchase request by ID
    const deletedPurchaseRequest = await PurchaseRequest.findByIdAndDelete(id);

    if (!deletedPurchaseRequest) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }

    res.status(204).json({ status:"success",message: 'Deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getTotalRequestedItems = async (req, res) => {
  try {
    const purchaseRequests = await PurchaseRequest.find();
    const totalItemsRequested = purchaseRequests.reduce((total, request) => total + request.quantity, 0);

    res.status(200).json({ totalItemsRequested });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

