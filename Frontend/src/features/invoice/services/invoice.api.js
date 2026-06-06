import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/invoices",
  withCredentials: true,
});

export const getInvoices = async () => {
  const res = await api.get("/");
  return res.data;
};

export const getInvoiceDetails = async (id) => {
  const res = await api.get(`/${id}`);
  return res.data;
};
