// Import the Inspection model
import Inspection from '../Model/inspectionStatusSchema.js';

/**
 * tags:
 *   name: Inspections
 *   description: API endpoints for managing inspections
 */

/**
 * components:
 *   schemas:
 *     Inspection:
 *       type: object
 *       properties:
 *         itemId:
 *           type: string
 *           description: The ID of the inspected item
 *         itemName:
 *           type: string
 *           description: The name of the inspected item
 *         inspectionDescription:
 *           type: string
 *           description: Description of the inspection
 *         status:
 *           type: string
 *           enum: [pending, under Inspection, completed]
 *           description: The stat  us of the inspection
 *         otherDetails:
 *           type: string
 *           description: Other details related to the inspection
 */

/**
 * /inspections:
 *   get:
 *     summary: Get all inspections
 *     description: Retrieves all inspections.
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term to filter inspections by itemName
 *     responses:
 *       200:
 *         description: A list of inspections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inspection'
 *       500:
 *         description: Internal server error
 */
export const getAllInspections = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';  // Extract search term from query parameters
    const query = {
      itemName: { $regex: new RegExp(searchTerm, 'i') }  // Case-insensitive search on itemName
    };

    const inspections = await Inspection.find(query);
    // console.log(inspections,"inspections")
    res.status(200).json(inspections);
    
  } catch (error) {
    console.error('Error fetching inspections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * /inspections/item/{itemId}:
 *   get:
 *     summary: Get inspections by Item ID
 *     description: Retrieves inspections for a specific item by its ID.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the item to retrieve inspections for
 *     responses:
 *       200:
 *         description: A list of inspections for the specified item
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inspection'
 *       404:
 *         description: Inspections not found for the specified Item ID
 *       500:
 *         description: Internal server error
 */
export const getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.inspectionId);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }
    res.status(200).json(inspection);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

export const getInspectionByItemId = async (req, res) => {
  try {
    const inspections = await Inspection.find({ itemId: req.params.itemId });
    // console.log(inspections,"inspection");

    // if (!inspections || inspections.length === 0) {
    //   return res.status(404).json({ error: 'Inspections not found for the specified Item ID' });
    // }

    res.status(200).json(inspections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * /inspections:
 *   post:
 *     summary: Create a new inspection
 *     description: Creates a new inspection with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inspection'
 *     responses:
 *       201:
 *         description: Successfully created a new inspection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inspection'
 *       500:
 *         description: Internal server error
 */
export const createInspection = async (req, res) => {
  try {
    const { itemId, itemName, inspectionDescription, status,otherDetails } = req.body;
    const newInspection = new Inspection({
      itemId,
      itemName,
      inspectionDescription,
      status: status || 'pending',
      otherDetails : otherDetails || "no details added"
    });
    const savedInspection = await newInspection.save();
    res.status(201).json(savedInspection);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * /inspections/{inspectionId}:
 *   put:
 *     summary: Update an inspection by ID
 *     description: Updates an inspection with the provided details.
 *     parameters:
 *       - in: path
 *         name: inspectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the inspection to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inspection'
 *     responses:
 *       200:
 *         description: Successfully updated the inspection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inspection'
 *       404:
 *         description: Inspection not found
 *       500:
 *         description: Internal server error
 */
export const updateInspectionById = async (req, res) => {
  try {
    const { inspectionDescription, status, otherDetails } = req.body;
    // console.log(req.body,"body");
    
    // Ensure that the status is one of the allowed values
    if (!['pending', 'under Inspection', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedInspection = await Inspection.findByIdAndUpdate(
      req.params.inspectionId,
      { inspectionDescription, status, otherDetails },
      { new: true }
    );

    if (!updatedInspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    res.status(200).json(updatedInspection);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * /inspections/{inspectionId}:
 *   delete:
 *     summary: Delete an inspection by ID
 *     description: Deletes an inspection by its ID.
 *     parameters:
 *       - in: path
 *         name: inspectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the inspection to delete
 *     responses:
 *       200:
 *         description: Inspection deleted successfully
 *       404:
 *         description: Inspection not found
 *       500:
 *         description: Internal server error
 */
export const deleteInspectionById = async (req, res) => {
  // console.log(req.params.itemId,"item id")
  try {
    const deletedInspection = await Inspection.findOneAndDelete({
      itemId: req.params.itemId
    });
    if (!deletedInspection) {
      return res.status(404).json({ error: 'Inspection not found for the given item ID' });
    }
    res.status(200).json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

