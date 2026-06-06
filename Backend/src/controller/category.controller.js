import CategoryService from "../service/category.service.js";

class CategoryController {
  // GET /api/categories - Get all categories
  async getCategories(req, res) {
    try {
      const result = await CategoryService.getAllCategories();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  // GET /api/categories/:id - Get category by ID
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const result = await CategoryService.getCategoryById(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  // POST /api/categories - Create category
  async createCategory(req, res) {
    try {
      const { name, description } = req.body;

      // Validate request body
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
          data: null,
        });
      }

      const result = await CategoryService.createCategory({
        name,
        description,
      });

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  // PUT /api/categories/:id - Update category
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // Validate request body
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
          data: null,
        });
      }

      const result = await CategoryService.updateCategory(id, {
        name,
        description,
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  // DELETE /api/categories/:id - Delete category
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Category ID is required",
          data: null,
        });
      }

      const result = await CategoryService.deleteCategory(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
}

export default new CategoryController();
