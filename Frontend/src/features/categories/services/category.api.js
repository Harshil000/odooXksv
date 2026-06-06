import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/categories",
  withCredentials: true,
});

export async function getCategories() {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
}

export async function getCategoryById(id) {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error.response?.data || { message: "Failed to fetch category" };
  }
}

export async function createCategory(data) {
  try {
    const response = await api.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error.response?.data || { message: "Failed to create category" };
  }
}

export async function updateCategory(id, data) {
  try {
    const response = await api.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error.response?.data || { message: "Failed to update category" };
  }
}

export async function deleteCategory(id) {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error.response?.data || { message: "Failed to delete category" };
  }
}
