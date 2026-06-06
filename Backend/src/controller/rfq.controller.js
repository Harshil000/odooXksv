import { createRfqTx, findAllRfqs, findRfqById, updateRfqTx } from "../repository/rfq.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/rfq
// ─────────────────────────────────────────────────────────────────────────────
export async function createRfqController(req, res, next) {
  const { title, description, deadline, items, vendor_ids } = req.body;
  const created_by = req.user.id; // From verifyToken middleware

  try {
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "RFQ Title is required" });
    }
    if (!deadline) {
      return res.status(400).json({ message: "RFQ Deadline is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one product item is required" });
    }

    // Validate items
    for (const item of items) {
      if (!item.product_name || !item.product_name.trim()) {
        return res.status(400).json({ message: "Product Name is required for all items" });
      }
      if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0) {
        return res.status(400).json({ message: "Quantity must be a positive number for all items" });
      }
    }

    const rfq = await createRfqTx({
      title: title.trim(),
      description: description ? description.trim() : null,
      deadline,
      created_by,
      items,
      vendor_ids: Array.isArray(vendor_ids) ? vendor_ids : [],
    });

    return res.status(201).json({
      message: "RFQ created successfully",
      rfq,
    });
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rfq
// ─────────────────────────────────────────────────────────────────────────────
export async function getAllRfqsController(req, res, next) {
  try {
    const rfqs = await findAllRfqs();
    return res.status(200).json(rfqs);
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rfq/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function getRfqByIdController(req, res, next) {
  const { id } = req.params;

  try {
    const rfq = await findRfqById(id);
    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }
    return res.status(200).json(rfq);
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/rfq/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function updateRfqController(req, res, next) {
  const { id } = req.params;
  const { title, description, deadline, status, items, vendor_ids } = req.body;

  try {
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "RFQ Title is required" });
    }
    if (!deadline) {
      return res.status(400).json({ message: "RFQ Deadline is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one product item is required" });
    }

    // Validate items
    for (const item of items) {
      if (!item.product_name || !item.product_name.trim()) {
        return res.status(400).json({ message: "Product Name is required for all items" });
      }
      if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0) {
        return res.status(400).json({ message: "Quantity must be a positive number for all items" });
      }
    }

    const rfq = await updateRfqTx(id, {
      title: title.trim(),
      description: description ? description.trim() : null,
      deadline,
      status: status || "OPEN",
      items,
      vendor_ids: Array.isArray(vendor_ids) ? vendor_ids : [],
    });

    return res.status(200).json({
      message: "RFQ updated successfully",
      rfq,
    });
  } catch (error) {
    next(error);
  }
}
