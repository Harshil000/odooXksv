import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  submitQuotation,
  updateQuotation,
  getQuotationDetails,
  getQuotations,
  getMyQuotationForRfq,
} from "../controller/quotation.controller.js";

const quotationRouter = Router();

// Secure all quotation endpoints
quotationRouter.use(verifyToken);

quotationRouter.get("/", getQuotations);
quotationRouter.post("/", submitQuotation);
quotationRouter.get("/:id", getQuotationDetails);
quotationRouter.put("/:id", updateQuotation);
quotationRouter.get("/rfq/:rfqId/my", getMyQuotationForRfq);

export default quotationRouter;
