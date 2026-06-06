import { createApprovalTx, findApprovalsByQuotation } from "../repository/approval.repository.js";
import { findQuotationById } from "../repository/quotation.repository.js";

/**
 * Handles submitting an approval or rejection decision.
 */
export async function submitApproval(req, res, next) {
  try {
    // 1. Role validation: only MANAGER and ADMIN
    if (req.user.role !== "MANAGER" && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Only Managers or Admins can approve or reject quotations" });
    }

    const { quotation_id, status, remarks } = req.body;
    if (!quotation_id) {
      return res.status(400).json({ message: "quotation_id is required" });
    }
    if (!status || (status !== "APPROVED" && status !== "REJECTED")) {
      return res.status(400).json({ message: "status must be APPROVED or REJECTED" });
    }

    const approval = await createApprovalTx(Number(req.user.id), {
      quotation_id: Number(quotation_id),
      status,
      remarks,
    });

    return res.status(201).json({
      message: `Quotation has been successfully ${status.toLowerCase()}!`,
      approval,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns the approval history for a specific quotation.
 */
export async function getApprovalsForQuotation(req, res, next) {
  try {
    const { quotationId } = req.params;
    if (!quotationId) {
      return res.status(400).json({ message: "quotationId parameter is required" });
    }

    // Security check: Vendors can only view approvals for their own quotation
    const quotation = await findQuotationById(Number(quotationId));
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (req.user.role === "VENDOR" && Number(quotation.vendor_id) !== Number(req.user.vendor_id)) {
      return res.status(403).json({ message: "Forbidden: You do not own this quotation" });
    }

    const approvals = await findApprovalsByQuotation(Number(quotationId));
    return res.status(200).json(approvals);
  } catch (error) {
    next(error);
  }
}
