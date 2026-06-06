import axios from "axios";

const quotationsApi = axios.create({
  baseURL: "http://localhost:3000/api/quotations",
  withCredentials: true,
});

const approvalsApi = axios.create({
  baseURL: "http://localhost:3000/api/approvals",
  withCredentials: true,
});

const negotiationsApi = axios.create({
  baseURL: "http://localhost:3000/api/negotiations",
  withCredentials: true,
});

const poApi = axios.create({
  baseURL: "http://localhost:3000/api/purchase-orders",
  withCredentials: true,
});

export const getPendingQuotations = async () => {
  const res = await quotationsApi.get("/");
  return res.data;
};

export const getQuotationApprovals = async (quotationId) => {
  const res = await approvalsApi.get(`/quotation/${quotationId}`);
  return res.data;
};

export const submitApprovalLog = async (quotationId, status, remarks) => {
  const res = await approvalsApi.post("/", {
    quotation_id: quotationId,
    status,
    remarks,
  });
  return res.data;
};

export const getNegotiationComments = async (quotationId) => {
  const res = await negotiationsApi.get(`/quotation/${quotationId}`);
  return res.data;
};

export const postNegotiationComment = async (quotationId, message, proposedAmount) => {
  const res = await negotiationsApi.post("/", {
    quotation_id: quotationId,
    message,
    proposed_amount: proposedAmount,
  });
  return res.data;
};

export const autoGeneratePoAndInvoice = async (quotationId) => {
  const res = await poApi.post("/", {
    quotation_id: quotationId,
  });
  return res.data;
};
