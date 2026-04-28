import { Router } from "express";
import { MenuController } from "../controllers/menu.controller";

const router = Router();
const menuController = new MenuController();

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu endpoints
 */

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter items by category (e.g. Burgers, Pizza)
 *     responses:
 *       200:
 *         description: List of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 */
router.get("/", menuController.getAll);

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get a single menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the menu item
 *     responses:
 *       200:
 *         description: Menu item fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Menu item not found
 */
router.get("/:id", menuController.getById);

export default router;
