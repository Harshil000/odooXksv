import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../features/categories/services/category.api";
import "../styles/category-modal.scss";

const CategoryModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch categories on modal open
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully!");
      }

      setFormData({ name: "", description: "" });
      setEditingId(null);
      await fetchCategories();
    } catch (error) {
      toast.error(error?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      await fetchCategories();
    } catch (error) {
      toast.error(error?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Manage Categories</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Form Section */}
          <div className="form-section">
            <h3 className="section-title">
              {editingId ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g., Construction Materials"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Enter category description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={loading}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Category"
                      : "Add Category"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List Section */}
          <div className="list-section">
            <h3 className="section-title">
              Existing Categories ({categories.length})
            </h3>

            {loading && !editingId ? (
              <div className="loading">Loading categories...</div>
            ) : categories.length > 0 ? (
              <div className="categories-list">
                {categories.map((category) => (
                  <div key={category.id} className="category-item">
                    <div className="category-info">
                      <h4 className="category-name">{category.name}</h4>
                      {category.description && (
                        <p className="category-description">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="category-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(category)}
                        disabled={loading}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(category.id)}
                        disabled={loading}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No categories found. Create one!
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
