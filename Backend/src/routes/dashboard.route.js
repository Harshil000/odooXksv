import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getDashboardData } from "../controller/dashboard.controller.js";

const dashboardRouter = Router();

// Secure all dashboard endpoints
dashboardRouter.use(verifyToken);

dashboardRouter.get("/", getDashboardData);

export default dashboardRouter;
