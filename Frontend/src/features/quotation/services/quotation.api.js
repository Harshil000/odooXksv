import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/quotations",
  withCredentials: true,
});

export const fetchQuotations = async (rfqId) => {
  const url = rfqId ? `/?rfq_id=${rfqId}` : "/";
  const res = await api.get(url);
  return res.data;
};

export const createQuotation = async (data) => {
  const res = await api.post("/", data);
  return res.data;
};

export const updateQuotation = async (id, data) => {
  const res = await api.put(`/${id}`, data);
  return res.data;
};

export const deleteQuotation = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};

export const fetchMyQuotationForRfq = async (rfqId) => {
  const res = await api.get(`/rfq/${rfqId}/my`);
  return res.data;
};
