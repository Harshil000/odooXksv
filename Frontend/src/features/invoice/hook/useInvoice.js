import { useState, useCallback } from "react";
import { getInvoices, getInvoiceDetails } from "../services/invoice.api";
import axios from "axios";

const quotationsApi = axios.create({
  baseURL: "http://localhost:3000/api/quotations",
  withCredentials: true,
});

export default function useInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data || []);
      setError(null);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load invoices list");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInvoiceDetails = useCallback(async (invoice) => {
    try {
      setSelectedInvoice(invoice);
      setInvoiceDetails(null);
      setLoading(true);

      const details = await getInvoiceDetails(invoice.id);

      // Fetch corresponding quotation to get line items
      if (details.quotation_id) {
        const quoteRes = await quotationsApi.get(`/${details.quotation_id}`);
        details.items = quoteRes.data.items || [];
        details.vendor_address = quoteRes.data.address;
        details.vendor_phone = quoteRes.data.phone;
      }
      
      setInvoiceDetails(details);
      setError(null);
      return details;
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    invoices,
    selectedInvoice,
    invoiceDetails,
    loading,
    error,
    loadInvoices,
    loadInvoiceDetails,
  };
}
