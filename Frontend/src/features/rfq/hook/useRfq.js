import { useState, useCallback } from "react";
import { fetchRfqs, fetchActiveVendors, createRfq, fetchRfqDetails, updateRfq } from "../services/rfq.api";

export default function useRfq() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch all RFQs
  const loadRfqs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchRfqs();
      setRfqs(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch active vendors list
  const loadVendors = useCallback(async () => {
    try {
      setLoadingVendors(true);
      const data = await fetchActiveVendors();
      setVendors(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoadingVendors(false);
    }
  }, []);

  // 3. Fetch single RFQ details
  const loadRfqDetails = useCallback(async (id) => {
    try {
      setLoadingDetails(true);
      const data = await fetchRfqDetails(id);
      setSelectedRfq(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  // 4. Create new RFQ
  const publishRfq = useCallback(async (rfqData) => {
    try {
      setSubmitting(true);
      const response = await createRfq(rfqData);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // 5. Update RFQ
  const updateRfqDetails = useCallback(async (id, rfqData) => {
    try {
      setSubmitting(true);
      const response = await updateRfq(id, rfqData);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    rfqs,
    loading,
    vendors,
    loadingVendors,
    selectedRfq,
    setSelectedRfq,
    loadingDetails,
    submitting,
    loadRfqs,
    loadVendors,
    loadRfqDetails,
    publishRfq,
    updateRfqDetails,
  };
}
