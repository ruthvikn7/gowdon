// controllers/DeliveryItemController.js

import DeliveryItem from "../../Model/PurchaseDepartment/DeliveryItemSchema.js";
import Supplier from "../../Model/PurchaseDepartment/SupplierSchema.js";
import Delivery from "../../Model/PurchaseDepartment/DeliverySchema.js";
import Evaluator from "../../Model/PurchaseDepartment/EvaluatorSchema.js";
import Item from "../../Model/PurchaseDepartment/ItemSchema.js";

/**
 * tags:
 *   name: Delivery Items
 *   description: API endpoints for managing delivery items
 */

/**
 * components:
 *   schemas:
 *     DeliveryItem:
 *       type: object
 *       properties:
 *         delivery_id:
 *           type: string
 *           description: The ID of the delivery associated with the item
 *         item_id:
 *           type: string
 *           description: The ID of the item being delivered
 *         supplier_id:
 *           type: string
 *           description: The ID of the supplier providing the item
 *         price:
 *           type: number
 *           description: The price of the delivered item
 *         quantity:
 *           type: number
 *           description: The quantity of the delivered item
 *         individual_item_rating:
 *           type: number
 *           description: The rating of the delivered item
 *         individual_item_rating_reason:
 *           type: string
 *           description: The reason for the individual item rating
 *         evaluator_id:
 *           type: string
 *           description: The ID of the evaluator providing the rating
 *         evaluation_date:
 *           type: string
 *           format: date
 *           description: The date of evaluation
 */

/**
 * /delivery-items:
 *   get:
 *     summary: Retrieve all delivery items
 *     description: Retrieves a list of all delivery items along with related entities.
 *     responses:
 *       200:
 *         description: A list of delivery items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryItem'
 */
export async function getAllDeliveryItems(req, res) {
  try {
    const deliveryItems = await DeliveryItem.find()
      .populate('delivery_id')
      .populate('item_id')
      .populate('supplier_id')
      .populate('evaluator_id');
    res.json(deliveryItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * /delivery-items:
 *   post:
 *     summary: Create a new delivery item
 *     description: Creates a new delivery item with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryItem'
 *     responses:
 *       201:
 *         description: The created delivery item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryItem'
 *       400:
 *         description: Bad request, validation error
 */
export async function createDeliveryItem(req, res) {
  const {
    delivery_id,
    item_id,
    supplier_id,
    price,
    quantity,
    individual_item_rating,
    individual_item_rating_reason,
    evaluator_id,
    evaluation_date = new Date()
  } = req.body;

  try {
    // Find the IDs based on the provided names
    if (!item_id || !supplier_id || !evaluator_id) {
      return res.status(404).json({ message: 'One or more entities not found' });
    }

    // Check if the evaluator has already filled feedback for this delivery
    const existingDeliveryItem = await DeliveryItem.findOne({
      delivery_id,
      evaluator_id
    });

    if (existingDeliveryItem) {
      return res.status(409).json({ message: 'Feedback already submitted by this evaluator for the given delivery' });
    }

    const newDeliveryItem = new DeliveryItem({
      delivery_id,
      item_id,
      supplier_id,
      price,
      quantity,
      individual_item_rating,
      individual_item_rating_reason,
      evaluator_id,
      evaluation_date
    });

    const savedDeliveryItem = await newDeliveryItem.save();
    res.status(201).json(savedDeliveryItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

/**
 * /delivery-items/{id}:
 *   get:
 *     summary: Retrieve a delivery item by ID
 *     description: Retrieves details of a delivery item by its ID along with related entities.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the delivery item
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the delivery item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryItem'
 *       404:
 *         description: Delivery item not found
 */
export async function getDeliveryItemById(req, res) {
  const deliveryItemId = req.params.id;

  try {
    const deliveryItem = await DeliveryItem.findById(deliveryItemId)
      .populate('delivery_id')
      .populate('item_id')
      .populate('supplier_id')
      .populate('evaluator_id');  // Populate the evaluator_id field

    if (!deliveryItem) {
      return res.status(404).json({ message: 'Delivery item not found' });
    }

    res.json(deliveryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /delivery-items/{id}:
 *   put:
 *     summary: Update a delivery item by ID
 *     description: Updates details of a delivery item by its ID with the provided data.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the delivery item
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryItem'
 *     responses:
 *       200:
 *         description: The updated delivery item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryItem'
 *       404:
 *         description: Delivery item not found
 */
export async function updateDeliveryItemById(req, res) {
  const deliveryItemId = req.params.id;
  const {
   delivery_id,
    item_id,
    supplier_id,
    price,
    quantity,
    individual_item_rating,
    individual_item_rating_reason,
    evaluator_id,
    evaluation_date = new Date()
  } = req.body;

  try {
    const updatedDeliveryItem = await DeliveryItem.findByIdAndUpdate(
      deliveryItemId,
      {
        delivery_id,
    item_id,
    supplier_id,
    price,
    quantity,
    individual_item_rating,
    individual_item_rating_reason,
    evaluator_id,
    evaluation_date 
      },
      { new: true }
    )
      .populate('delivery_id')
      .populate('item_id')
      .populate('supplier_id')
      .populate('evaluator_id');  // Populate the evaluator_id field

    if (!updatedDeliveryItem) {
      return res.status(404).json({ message: 'Delivery item not found' });
    }

    res.json(updatedDeliveryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /delivery-items/{id}:
 *   delete:
 *     summary: Delete a delivery item by ID
 *     description: Deletes a delivery item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the delivery item
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the delivery item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 deletedDeliveryItem:
 *                   $ref: '#/components/schemas/DeliveryItem'
 *       404:
 *         description: Delivery item not found
 */
export async function deleteDeliveryItemById(req, res) {
  const deliveryItemId = req.params.id;

  try {
    const deletedDeliveryItem = await DeliveryItem.findByIdAndDelete(deliveryItemId);

    if (!deletedDeliveryItem) {
      return res.status(404).json({ message: 'Delivery item not found' });
    }

    res.json({ message: 'Delivery item deleted successfully', deletedDeliveryItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getOverallRating(supplierId) {
  try {
    const deliveries = await Delivery.find({ supplier_id: supplierId });

    if (deliveries.length === 0) {
      return 0;
    }

    const totalRating = deliveries.reduce((sum, delivery) => sum + delivery.overall_rating, 0);
    return totalRating / deliveries.length;
  } catch (error) {
    console.error(error);
    return 0;
  }
}



export async function getAllRatings(req, res) {
  try {
    const deliveryItems = await DeliveryItem.find()
      .populate('delivery_id')
      .populate('item_id')
      .populate('supplier_id')
      .populate('evaluator_id');

    const deliveryItemsWithSupplier = await Promise.all(
      deliveryItems.map(async (deliveryItem) => {
        const supplier = await Supplier.findById(deliveryItem.supplier_id);
        const averageRating = await getAverageRating(deliveryItem.supplier_id);
        const overallRating = await getOverallRating(deliveryItem.supplier_id);

        return {
          ...deliveryItem.toObject(),
          supplier: supplier ? supplier.name : '', // Add supplier name to the result
          averageRating,
          overallRating,
        };
      })
    );

    // console.log(deliveryItemsWithSupplier,"supplier")
    res.json(deliveryItemsWithSupplier);
  } catch (error) {
    console.log(error);
    // console.log(error,"ruthvik")
    res.status(500).json({ message: error.message });
  }
}

async function getAverageRating(supplierId) {
  const ratings = await DeliveryItem.find({ supplier_id: supplierId })
    .select('individual_item_rating');

  if (ratings.length === 0) {
    return 0;
  }

  const totalRating = ratings.reduce((sum, rating) => sum + rating.individual_item_rating, 0);//sum accumulator
  return totalRating / ratings.length;
}