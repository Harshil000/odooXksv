import { pool } from "../config/database.js";

class CategoryRepository {
  // Get all categories
  async getAll() {
    const result = await pool.query(
      "SELECT id, name, description, created_at, updated_at FROM categories ORDER BY name ASC",
    );
    return result.rows;
  }

  // Get category by ID
  async getById(id) {
    const result = await pool.query(
      "SELECT id, name, description, created_at, updated_at FROM categories WHERE id = $1",
      [id],
    );
    return result.rows[0] || null;
  }

  // Get category by name
  async getByName(name) {
    const result = await pool.query(
      "SELECT id, name, description, created_at, updated_at FROM categories WHERE name ILIKE $1",
      [name],
    );
    return result.rows[0] || null;
  }

  // Create category
  async create(name, description) {
    const result = await pool.query(
      "INSERT INTO categories (name, description, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, name, description, created_at, updated_at",
      [name, description],
    );
    return result.rows[0];
  }

  // Update category
  async update(id, name, description) {
    const result = await pool.query(
      "UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, description, created_at, updated_at",
      [name, description, id],
    );
    return result.rows[0] || null;
  }

  // Delete category
  async delete(id) {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING id",
      [id],
    );
    return result.rowCount > 0;
  }

  // Check if category exists
  async exists(id) {
    const result = await pool.query(
      "SELECT 1 FROM categories WHERE id = $1 LIMIT 1",
      [id],
    );
    return result.rowCount > 0;
  }
}

export default new CategoryRepository();
