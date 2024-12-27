// controllers/ItemController.js

import Item from "../../Model/PurchaseDepartment/ItemSchema.js";

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
 *         category_id:
 *           type: string
 *           description: The ID of the category to which the item belongs
 *         description:
 *           type: string
 *           description: Description of the item
 *         // Define other fields as needed
 */

/**
 * /items:
 *   get:
 *     summary: Retrieve all items
 *     description: Retrieves a list of all items.
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
export async function getAllItems(req, res) {
  try {
    const items = await Item.find().populate('category_id');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
 *         description: The created item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad request, validation error
 */
export async function createItem(req, res) {
  const { name, category_id, description /* other fields */ } = req.body;
  const newItem = new Item({ name, category_id, description /* other fields */ });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * /items/{id}:
 *   get:
 *     summary: Retrieve an item by ID
 *     description: Retrieves details of an item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the item
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
export async function getItemById(req, res) {
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId).populate('category_id');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     description: Updates an item with the provided details.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the item
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Updated item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
export async function updateItemById(req, res) {
  const itemId = req.params.id;
  const { name, category_id, description /* other fields */ } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { name, category_id, description /* other fields */ },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     description: Deletes an item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the item
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 deletedItem:
 *                   $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found..
 */
export async function deleteItemById(req, res) {
  const itemId = req.params.id;

  try {
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully', deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

