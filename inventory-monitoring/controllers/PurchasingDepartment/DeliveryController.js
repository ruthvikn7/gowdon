import Delivery from "../../Model/PurchaseDepartment/DeliverySchema.js";

/**
 * /deliveries:
 *   get:
 *     summary: Retrieve all deliveries
 *     description: Retrieves a list of all deliveries along with their supplier details.
 *     responses:
 *       200:
 *         description: A list of deliveries with supplier details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 */
export async function getAllDeliveries(req, res) {
  try {
    const deliveries = await Delivery.find().populate('supplier_id')
    .populate('item_id');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /deliveries:
 *   post:
 *     summary: Create a new delivery
 *     description: Creates a new delivery with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: The created delivery
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Bad request, validation error
 */
export async function createDelivery(req, res) {
  
  const { supplier_id, item_id, delivery_date, overall_rating, overall_rating_reason } = req.body;
  // console.log(req.body,"delivery request");
  const newDelivery = new Delivery({
    supplier_id,
    item_id,
    delivery_date,
    overall_rating,
    overall_rating_reason
    // Other relevant fields
  });

  try {
    const savedDelivery = await newDelivery.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation error
      res.status(400).json({ message: error.message });
    } else {
      // Handle other errors
      res.status(500).json({ message: error.message });
    }
  }
}

/**
 * /deliveries/{id}:
 *   get:
 *     summary: Retrieve a delivery by ID
 *     description: Retrieves details of a delivery by its ID along with the supplier details.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the delivery
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the delivery
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 */
export async function getDeliveryById(req, res) {
  const deliveryId = req.params.id;

  try {
    const delivery = await Delivery.findById(deliveryId)
      .populate('supplier_id')
      .populate('item_id');
    
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /deliveries/{id}:
 *   put:
 *     summary: Update a delivery by ID
 *     description: Updates details of a delivery identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the delivery
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: The updated delivery
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 */
export async function updateDeliveryById(req, res) {
  const deliveryId = req.params.id;
  const { supplier_id, item_id, delivery_date, overall_rating, overall_rating_reason } = req.body;

  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { supplier_id, item_id, delivery_date, overall_rating, overall_rating_reason },
      { new: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /deliveries/{id}:
 *   delete:
 *     summary: Delete a delivery by ID
 *     description: Deletes a delivery identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the delivery
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 */
export async function deleteDeliveryById(req, res) {
  const deliveryId = req.params.id;

  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(deliveryId);

    if (!deletedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json({ message: 'Delivery deleted successfully', deletedDelivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
