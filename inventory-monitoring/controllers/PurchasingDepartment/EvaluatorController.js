// controllers/EvaluatorController.js

import Evaluator from "../../Model/PurchaseDepartment/EvaluatorSchema.js";

/**
 * tags:
 *   name: Evaluators
 *   description: API endpoints for managing evaluators
 */

/**
 * components:
 *   schemas:
 *     Evaluator:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the evaluator
 */

/**
 * /evaluators:
 *   get:
 *     summary: Retrieve all evaluators
 *     description: Retrieves a list of all evaluators.
 *     responses:
 *       200:
 *         description: A list of evaluators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluator'
 */
export async function getAllEvaluators(req, res) {
  try {
    const evaluators = await Evaluator.find();
    res.json(evaluators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /evaluators:
 *   post:
 *     summary: Create a new evaluator
 *     description: Creates a new evaluator with the provided name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evaluator'
 *     responses:
 *       201:
 *         description: The created evaluator
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluator'
 *       400:
 *         description: Bad request, validation error
 */
export async function createEvaluator(req, res) {
  const { name } = req.body;
  const newEvaluator = new Evaluator({ name });

  try {
    const savedEvaluator = await newEvaluator.save();
    res.status(201).json(savedEvaluator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * /evaluators/{id}:
 *   get:
 *     summary: Retrieve an evaluator by ID
 *     description: Retrieves details of an evaluator by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the evaluator
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the evaluator
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluator'
 *       404:
 *         description: Evaluator not found
 */
export async function getEvaluatorById(req, res) {
  const evaluatorId = req.params.id;

  try {
    const evaluator = await Evaluator.findById(evaluatorId);

    if (!evaluator) {
      return res.status(404).json({ message: 'Evaluator not found' });
    }

    res.json(evaluator);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * /evaluators/{id}:
 *   delete:
 *     summary: Delete an evaluator by ID
 *     description: Deletes an evaluator by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the evaluator
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the evaluator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 deletedEvaluator:
 *                   $ref: '#/components/schemas/Evaluator'
 *       404:
 *         description: Evaluator not found
 */
export async function deleteEvaluatorById(req, res) {
  const evaluatorId = req.params.id;

  try {
    const deletedEvaluator = await Evaluator.findByIdAndDelete(evaluatorId);

    if (!deletedEvaluator) {
      return res.status(404).json({ message: 'Evaluator not found' });
    }

    res.json({ message: 'Evaluator deleted successfully', deletedEvaluator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
