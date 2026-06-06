import {
  createQuotationTx,
  updateQuotationTx,
  findQuotationById,
  findQuotationByRfqAndVendor,
  findQuotations,
  deleteQuotationTx,
} from "../repository/quotation.repository.js";

/**
 * Checks if the logged-in user is a VENDOR and has a valid vendor profile.
 */
function enforceVendorRole(req) {
  if (req.user.role !== "VENDOR") {
    const err = new Error("Forbidden: Only vendors can perform this action");
    err.status = 403;
    throw err;
  }
  if (!req.user.vendor_id) {
    const err = new Error("Forbidden: Vendor profile not found for this user");
    err.status = 403;
    throw err;
  }
  return Number(req.user.vendor_id);
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/quotations
// ─────────────────────────────────────────────────────────────────────────────
export async function submitQuotation(req, res, next) {
  try {
    const vendorId = enforceVendorRole(req);
    const { rfq_id, delivery_days, notes, items, status } = req.body;

    if (!rfq_id) {
      return res.status(400).json({ message: "rfq_id is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items must be a non-empty array" });
    }

    const quotation = await createQuotationTx(vendorId, {
      rfq_id,
      delivery_days: delivery_days ? Number(delivery_days) : null,
      notes,
      items,
      status: status || "SUBMITTED",
    });

    return res.status(201).json({
      message: "Quotation submitted successfully",
      quotation,
    });
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/quotations/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function updateQuotation(req, res, next) {
  try {
    const vendorId = enforceVendorRole(req);
    const { id } = req.params;
    const { delivery_days, notes, items, status } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items must be a non-empty array" });
    }

    const quotation = await updateQuotationTx(Number(id), vendorId, {
      delivery_days: delivery_days ? Number(delivery_days) : null,
      notes,
      items,
      status: status || "SUBMITTED",
    });

    return res.status(200).json({
      message: "Quotation updated successfully",
      quotation,
    });
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/quotations/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function getQuotationDetails(req, res, next) {
  try {
    const { id } = req.params;
    const quotation = await findQuotationById(Number(id));

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // Security check: Vendor can only see their own quotation
    if (req.user.role === "VENDOR" && Number(quotation.vendor_id) !== Number(req.user.vendor_id)) {
      return res.status(403).json({ message: "Forbidden: You do not own this quotation" });
    }

    return res.status(200).json(quotation);
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/quotations
// ─────────────────────────────────────────────────────────────────────────────
export async function getQuotations(req, res, next) {
  try {
    const { rfq_id } = req.query;

    // Vendor: restricted to their own quotations
    if (req.user.role === "VENDOR") {
      const vendorId = Number(req.user.vendor_id);
      if (rfq_id) {
        const quotation = await findQuotationByRfqAndVendor(Number(rfq_id), vendorId);
        return res.status(200).json(quotation ? [quotation] : []);
      }
      const quotations = await findQuotations({ vendor_id: vendorId });
      return res.status(200).json(quotations);
    }

    // Manager/Procurement: can view all bids or filtered by rfq_id
    const quotations = await findQuotations({ rfq_id: rfq_id ? Number(rfq_id) : null });
    return res.status(200).json(quotations);
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/quotations/rfq/:rfqId/my
// ─────────────────────────────────────────────────────────────────────────────
export async function getMyQuotationForRfq(req, res, next) {
  try {
    const vendorId = enforceVendorRole(req);
    const { rfqId } = req.params;

    const quotation = await findQuotationByRfqAndVendor(Number(rfqId), vendorId);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found for this RFQ" });
    }

    return res.status(200).json(quotation);
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/quotations/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteQuotation(req, res, next) {
  try {
    const vendorId = enforceVendorRole(req);
    const { id } = req.params;

    await deleteQuotationTx(Number(id), vendorId);

    return res.status(200).json({
      message: "Quotation cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
}
