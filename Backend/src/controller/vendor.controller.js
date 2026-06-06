import { findActiveVendors, findAllVendors } from "../repository/vendor.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/vendors
// ─────────────────────────────────────────────────────────────────────────────
export async function getActiveVendorsController(req, res, next) {
  try {
    if (req.user?.role === "MANAGER" || req.user?.role === "ADMIN") {
      const vendors = await findAllVendors();
      return res.status(200).json(vendors);
    }
    const vendors = await findActiveVendors();
    return res.status(200).json(vendors);
  } catch (error) {
    next(error);
  }
}