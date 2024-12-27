// controllers/SupplierController.js

import Supplier from "../../Model/PurchaseDepartment/SupplierSchema.js";

/**
 * tags:
 *   name: Suppliers
 *   description: API endpoints for managing suppliers
 */

/**
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the supplier
 */

/**
 * /suppliers/{id}:
 *   get:
 *     summary: Retrieve a supplier by ID
 *     description: Retrieves details of a supplier by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the supplier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the supplier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 */
export async function getSupplierById(req, res) {
  const supplierId = req.params.id;

  try {
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /suppliers:
 *   get:
 *     summary: Retrieve all suppliers
 *     description: Retrieves a list of all suppliers.
 *     responses:
 *       200:
 *         description: A list of suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
export async function getAllSuppliers(req, res) {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
    console.log(error.message,"error");
  }
}

/**
 * /suppliers:
 *   post:
 *     summary: Create a new supplier
 *     description: Creates a new supplier with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: The created supplier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Bad request, validation error
 */
export async function createSupplier(req, res) {
  const { name,phonenumber,email } = req.body;
  // console.log(req.body,"suplier request")
  const newSupplier = new Supplier({ name,phonenumber,email });

  try {
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * /suppliers/{id}:
 *   put:
 *     summary: Update a supplier by ID
 *     description: Updates a supplier with the provided details.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the supplier
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Updated supplier details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 */
export async function updateSupplierById(req, res) {
  const supplierId = req.params.id;
  const { name } = req.body;

  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      { name },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier by ID
 *     description: Deletes a supplier by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the supplier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the supplier
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 deletedSupplier:
 *                   $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 */
export async function deleteSupplierById(req, res) {
  const supplierId = req.params.id;

  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);

    if (!deletedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully', deletedSupplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
