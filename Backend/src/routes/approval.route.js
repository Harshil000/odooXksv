import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  submitApproval,
  getApprovalsForQuotation,
} from "../controller/approval.controller.js";

const approvalRouter = Router();

// Secure all endpoints
approvalRouter.use(verifyToken);

approvalRouter.post("/", submitApproval);
approvalRouter.get("/quotation/:quotationId", getApprovalsForQuotation);

export default approvalRouter;
