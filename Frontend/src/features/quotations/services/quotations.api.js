import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/quotations",
    withCredentials: true,
});

// Get all quotations
export async function getAllQuotations(filters = {}) {
    try {
        const response = await api.get("/", { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching quotations:", error);
        throw error.response?.data || { message: "Failed to fetch quotations" };
    }
}

// Get quotation by ID
export async function getQuotationById(id) {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching quotation:", error);
        throw error.response?.data || { message: "Failed to fetch quotation" };
    }
}

// Get quotations for a specific RFQ
export async function getQuotationsByRFQ(rfqId) {
    try {
        const response = await api.get(`/rfq/${rfqId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching RFQ quotations:", error);
        throw error.response?.data || { message: "Failed to fetch quotations" };
    }
}

// Submit a quotation
export async function submitQuotation(rfqId, quotationData) {
    try {
        const response = await api.post(`/submit`, { rfq_id: rfqId, ...quotationData });
        return response.data;
    } catch (error) {
        console.error("Error submitting quotation:", error);
        throw error.response?.data || { message: "Failed to submit quotation" };
    }
}

// Update quotation
export async function updateQuotation(id, quotationData) {
    try {
        const response = await api.put(`/${id}`, quotationData);
        return response.data;
    } catch (error) {
        console.error("Error updating quotation:", error);
        throw error.response?.data || { message: "Failed to update quotation" };
    }
}

// Save quotation as draft
export async function saveDraftQuotation(rfqId, quotationData) {
    try {
        const response = await api.post(`/draft`, { rfq_id: rfqId, ...quotationData });
        return response.data;
    } catch (error) {
        console.error("Error saving draft:", error);
        throw error.response?.data || { message: "Failed to save draft" };
    }
}

// Get quotation comparison
export async function getQuotationComparison(rfqId) {
    try {
        const response = await api.get(`/compare/${rfqId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching comparison:", error);
        throw error.response?.data || { message: "Failed to fetch comparison" };
    }
}

export default api;
