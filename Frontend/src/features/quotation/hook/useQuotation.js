import { useState, useCallback } from "react";
import { fetchQuotations, createQuotation, updateQuotation, deleteQuotation, fetchMyQuotationForRfq } from "../services/quotation.api";
import axios from "axios";

const negotiationsApi = axios.create({
  baseURL: "http://localhost:3000/api/negotiations",
  withCredentials: true,
});

const rfqsApi = axios.create({
  baseURL: "http://localhost:3000/api/rfq",
  withCredentials: true,
});

export default function useQuotation() {
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [vendorQuotation, setVendorQuotation] = useState(null);
  const [rfqQuotations, setRfqQuotations] = useState([]);
  const [negThread, setNegThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRfqs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await rfqsApi.get("/");
      setRfqs(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      console.error(err);
      setError("Failed to load RFQs list");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRfqContext = useCallback(async (rfq, isVendor) => {
    setSelectedRfq(rfq);
    setVendorQuotation(null);
    setRfqQuotations([]);
    setNegThread([]);
    setLoading(true);

    try {
      if (isVendor) {
        try {
          const data = await fetchMyQuotationForRfq(rfq.id);
          setVendorQuotation(data);
          // Fetch negotiations thread
          const negRes = await negotiationsApi.get(`/quotation/${data.id}`);
          setNegThread(negRes.data || []);
        } catch (err) {
          if (err.response?.status !== 404) {
            setError("Failed to load your quotation");
          }
        }
      } else {
        const data = await fetchQuotations(rfq.id);
        setRfqQuotations(data || []);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load quotation context details");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBid = useCallback(async (quotationId, rfqId, deliveryDays, notes, itemsPayload) => {
    try {
      setLoading(true);
      let data;
      if (quotationId) {
        data = await updateQuotation(quotationId, {
          delivery_days: Number(deliveryDays),
          notes,
          items: itemsPayload,
          status: "SUBMITTED",
        });
      } else {
        data = await createQuotation({
          rfq_id: rfqId,
          delivery_days: Number(deliveryDays),
          notes,
          items: itemsPayload,
          status: "SUBMITTED",
        });
      }
      setVendorQuotation(data.quotation || data);
      setError(null);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save quotation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBid = useCallback(async (quotationId) => {
    try {
      setLoading(true);
      await deleteQuotation(quotationId);
      setVendorQuotation(null);
      setNegThread([]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to cancel quotation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNegotiations = useCallback(async (quotationId) => {
    try {
      const res = await negotiationsApi.get(`/quotation/${quotationId}`);
      setNegThread(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return {
    rfqs,
    selectedRfq,
    vendorQuotation,
    rfqQuotations,
    negThread,
    loading,
    error,
    loadRfqs,
    loadRfqContext,
    saveBid,
    cancelBid,
    loadNegotiations,
  };
}
