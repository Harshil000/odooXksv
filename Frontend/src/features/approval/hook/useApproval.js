import { useState, useCallback } from "react";
import {
  getPendingQuotations,
  getQuotationApprovals,
  submitApprovalLog,
  getNegotiationComments,
  postNegotiationComment,
  autoGeneratePoAndInvoice,
} from "../services/approval.api";

export default function useApproval() {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [negThread, setNegThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPendingQuotations();
      // Keep quotations in SUBMITTED or UNDER_NEGOTIATION status for approval page
      const pending = data.filter(
        (q) => q.status === "SUBMITTED" || q.status === "UNDER_NEGOTIATION"
      );
      setQuotations(pending);
      setError(null);
      return pending;
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending approvals list");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadQuoteContext = useCallback(async (quote) => {
    setSelectedQuote(quote);
    setError(null);
    setSuccessMsg(null);
    setApprovalHistory([]);
    setNegThread([]);
    setLoading(true);

    try {
      const logs = await getQuotationApprovals(quote.id);
      setApprovalHistory(logs || []);

      const comments = await getNegotiationComments(quote.id);
      setNegThread(comments || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load details for " + quote.quotation_number);
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadContext = useCallback(async (quoteId) => {
    try {
      const logs = await getQuotationApprovals(quoteId);
      setApprovalHistory(logs || []);

      const comments = await getNegotiationComments(quoteId);
      setNegThread(comments || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const approveQuotation = useCallback(async (quoteId, remarks) => {
    try {
      setError(null);
      setSuccessMsg(null);
      setLoading(true);

      // 1. Submit L1/L2 approval log
      await submitApprovalLog(quoteId, "APPROVED", remarks || "Approved and PO generated");

      // 2. Automatically generate purchase order and invoice
      const poRes = await autoGeneratePoAndInvoice(quoteId);

      setSuccessMsg(
        `Quotation approved! PO ${poRes.purchaseOrder.po_number} and Invoice ${poRes.invoice.invoice_number} auto-generated successfully.`
      );
      return poRes;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to complete approval");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectQuotation = useCallback(async (quoteId, remarks) => {
    try {
      setError(null);
      setSuccessMsg(null);
      setLoading(true);

      await submitApprovalLog(quoteId, "REJECTED", remarks || "Quotation rejected");
      setSuccessMsg("Quotation rejected successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit rejection");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendNegotiation = useCallback(async (quoteId, message, proposedAmount) => {
    try {
      setError(null);
      const res = await postNegotiationComment(quoteId, message, proposedAmount ? Number(proposedAmount) : null);
      await reloadContext(quoteId);
      setSuccessMsg("Bargaining message sent!");
      return res;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send bargaining message");
      throw err;
    }
  }, [reloadContext]);

  return {
    quotations,
    selectedQuote,
    approvalHistory,
    negThread,
    loading,
    error,
    successMsg,
    fetchPending,
    loadQuoteContext,
    reloadContext,
    approveQuotation,
    rejectQuotation,
    sendNegotiation,
    setError,
    setSuccessMsg,
  };
}
