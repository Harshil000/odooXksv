import express from "express";
import CategoryController from "../controller/category.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all category routes
router.use(verifyToken);

// GET /api/categories - Get all categories
router.get("/", CategoryController.getCategories);

// GET /api/categories/:id - Get category by ID
router.get("/:id", CategoryController.getCategoryById);

// POST /api/categories - Create category
router.post("/", CategoryController.createCategory);

// PUT /api/categories/:id - Update category
router.put("/:id", CategoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete("/:id", CategoryController.deleteCategory);

export default router;
