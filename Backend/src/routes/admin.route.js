import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getUsersListController,
  updateUserStatusController,
} from "../controller/admin.controller.js";

const adminRouter = Router();

// Secure all admin endpoints with authentication
adminRouter.use(verifyToken);

adminRouter.get("/users", getUsersListController);
adminRouter.put("/users/:id/status", updateUserStatusController);

export default adminRouter;
