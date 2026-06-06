import axios from "axios";

// RFQ API client configured to hit RFQ backend route
const rfqApi = axios.create({
  baseURL: "http://localhost:3000/api/rfq",
  withCredentials: true,
});

// Vendor API client to hit Vendor backend route
const vendorApi = axios.create({
  baseURL: "http://localhost:3000/api/vendors",
  withCredentials: true,
});

export async function fetchRfqs() {
  try {
    const response = await rfqApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching RFQs:", error);
    throw error.response?.data || { message: "Failed to fetch RFQs" };
  }
}

export async function createRfq(rfqData) {
  try {
    const response = await rfqApi.post("/", rfqData);
    return response.data;
  } catch (error) {
    console.error("Error creating RFQ:", error);
    throw error.response?.data || { message: "Failed to create RFQ" };
  }
}

export async function fetchRfqDetails(id) {
  try {
    const response = await rfqApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching RFQ ${id}:`, error);
    throw error.response?.data || { message: `Failed to fetch RFQ details` };
  }
}

export async function updateRfq(id, rfqData) {
  try {
    const response = await rfqApi.put(`/${id}`, rfqData);
    return response.data;
  } catch (error) {
    console.error(`Error updating RFQ ${id}:`, error);
    throw error.response?.data || { message: "Failed to update RFQ" };
  }
}

export async function fetchActiveVendors() {
  try {
    const response = await vendorApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching active vendors:", error);
    throw error.response?.data || { message: "Failed to fetch vendors" };
  }
}
