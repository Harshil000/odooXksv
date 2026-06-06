import { useState, useCallback } from "react";
import { getPurchaseOrders, getPoDetails, createPoAndInvoice } from "../services/po.api";

export default function usePurchaseOrder() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPo, setSelectedPo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPurchaseOrders();
      setPurchaseOrders(data || []);
      setError(null);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load purchase orders list");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPoDetails = useCallback(async (po) => {
    try {
      setSelectedPo(po);
      setLoading(true);
      const details = await getPoDetails(po.id);
      setSelectedPo(details);
      setError(null);
      return details;
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load purchase order details");
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePo = useCallback(async (quotationId) => {
    try {
      setLoading(true);
      const res = await createPoAndInvoice(quotationId);
      setError(null);
      return res;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate PO");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    purchaseOrders,
    selectedPo,
    loading,
    error,
    loadPurchaseOrders,
    loadPoDetails,
    generatePo,
  };
}
