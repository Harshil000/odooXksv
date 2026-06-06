import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/purchase-orders",
  withCredentials: true,
});

export const getPurchaseOrders = async () => {
  const res = await api.get("/");
  return res.data;
};

export const getPoDetails = async (id) => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const createPoAndInvoice = async (quotationId) => {
  const res = await api.post("/", { quotation_id: quotationId });
  return res.data;
};
