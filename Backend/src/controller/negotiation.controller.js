import { createNegotiationTx, findNegotiationsByQuotation } from "../repository/negotiation.repository.js";
import { findQuotationById } from "../repository/quotation.repository.js";

/**
 * Handles sending a negotiation message or bargaining price proposal.
 */
export async function submitNegotiation(req, res, next) {
  try {
    const { quotation_id, proposed_amount, message } = req.body;
    if (!quotation_id) {
      return res.status(400).json({ message: "quotation_id is required" });
    }

    // Security check: Vendors can only negotiate for their own quotation
    const quotation = await findQuotationById(Number(quotation_id));
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (req.user.role === "VENDOR" && Number(quotation.vendor_id) !== Number(req.user.vendor_id)) {
      return res.status(403).json({ message: "Forbidden: You do not own this quotation" });
    }

    const negotiation = await createNegotiationTx(Number(req.user.id), {
      quotation_id: Number(quotation_id),
      proposed_amount,
      message,
    });

    return res.status(201).json({
      message: "Negotiation message/proposal sent successfully",
      negotiation,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves the negotiation thread log for a specific quotation.
 */
export async function getNegotiationThread(req, res, next) {
  try {
    const { quotationId } = req.params;
    if (!quotationId) {
      return res.status(400).json({ message: "quotationId parameter is required" });
    }

    // Security check: Vendors can only view negotiations for their own quotation
    const quotation = await findQuotationById(Number(quotationId));
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (req.user.role === "VENDOR" && Number(quotation.vendor_id) !== Number(req.user.vendor_id)) {
      return res.status(403).json({ message: "Forbidden: You do not own this quotation" });
    }

    const thread = await findNegotiationsByQuotation(Number(quotationId));
    return res.status(200).json(thread);
  } catch (error) {
    next(error);
  }
}
