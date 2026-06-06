import { findActiveVendors } from "../repository/vendor.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/vendors
// ─────────────────────────────────────────────────────────────────────────────
export async function getActiveVendorsController(req, res, next) {
  try {
    const vendors = await findActiveVendors();
    return res.status(200).json(vendors);
  } catch (error) {
    next(error);
  }
}
