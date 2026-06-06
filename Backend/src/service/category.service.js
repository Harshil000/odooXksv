import CategoryRepository from "../repository/category.repository.js";

class CategoryService {
  // Get all categories
  async getAllCategories() {
    try {
      const categories = await CategoryRepository.getAll();
      return {
        success: true,
        data: categories,
        message: "Categories retrieved successfully",
      };
    } catch (error) {
      throw new Error(`Failed to retrieve categories: ${error.message}`);
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      // Validate ID
      if (!id || isNaN(id)) {
        throw new Error("Invalid category ID");
      }

      const category = await CategoryRepository.getById(id);
      if (!category) {
        throw new Error("Category not found");
      }

      return {
        success: true,
        data: category,
        message: "Category retrieved successfully",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create category
  async createCategory(data) {
    try {
      const { name, description } = data;

      // Validate required fields
      if (!name || name.trim() === "") {
        throw new Error("Category name is required");
      }

      // Check if name already exists
      const existing = await CategoryRepository.getByName(name);
      if (existing) {
        throw new Error(`Category with name "${name}" already exists`);
      }

      const category = await CategoryRepository.create(
        name.trim(),
        description?.trim() || null,
      );

      return {
        success: true,
        data: category,
        message: "Category created successfully",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update category
  async updateCategory(id, data) {
    try {
      const { name, description } = data;

      // Validate ID
      if (!id || isNaN(id)) {
        throw new Error("Invalid category ID");
      }

      // Validate required fields
      if (!name || name.trim() === "") {
        throw new Error("Category name is required");
      }

      // Check if category exists
      const existing = await CategoryRepository.getById(id);
      if (!existing) {
        throw new Error("Category not found");
      }

      // Check if name already exists (and is not the same category)
      const nameExists = await CategoryRepository.getByName(name);
      if (nameExists && nameExists.id !== parseInt(id)) {
        throw new Error(`Category with name "${name}" already exists`);
      }

      const category = await CategoryRepository.update(
        id,
        name.trim(),
        description?.trim() || null,
      );

      return {
        success: true,
        data: category,
        message: "Category updated successfully",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      // Validate ID
      if (!id || isNaN(id)) {
        throw new Error("Invalid category ID");
      }

      // Check if category exists
      const existing = await CategoryRepository.getById(id);
      if (!existing) {
        throw new Error("Category not found");
      }

      const deleted = await CategoryRepository.delete(id);
      if (!deleted) {
        throw new Error("Failed to delete category");
      }

      return {
        success: true,
        data: null,
        message: "Category deleted successfully",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new CategoryService();
