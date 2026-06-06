import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getReportsDataController } from "../controller/reports.controller.js";

const reportsRouter = Router();

reportsRouter.use(verifyToken);
reportsRouter.get("/", getReportsDataController);

export default reportsRouter;
