import { getDashboardStats } from "../repository/dashboard.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard
// ─────────────────────────────────────────────────────────────────────────────
export async function getDashboardData(req, res, next) {
  try {
    const { role, vendor_id } = req.user;
    const stats = await getDashboardStats(role, vendor_id);
    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}
