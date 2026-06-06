import { findAllUsers, updateUserStatusTx } from "../repository/user.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/users
// ─────────────────────────────────────────────────────────────────────────────
export async function getUsersListController(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    const users = await findAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/users/:id/status
// ─────────────────────────────────────────────────────────────────────────────
export async function updateUserStatusController(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({ message: "Bad Request: is_active must be a boolean" });
    }

    const targetUserId = Number(id);
    const currentUserId = Number(req.user.id);

    if (targetUserId === currentUserId && !is_active) {
      return res.status(400).json({ message: "Bad Request: Admins cannot deactivate their own accounts" });
    }

    const updatedUser = await updateUserStatusTx(targetUserId, is_active);
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}
