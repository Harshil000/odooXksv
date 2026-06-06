import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createRfqController,
  getAllRfqsController,
  getRfqByIdController,
  updateRfqController,
} from "../controller/rfq.controller.js";

const rfqRouter = Router();

// Secure all RFQ routes with auth verification
rfqRouter.use(verifyToken);

rfqRouter.get("/", getAllRfqsController);
rfqRouter.post("/", createRfqController);
rfqRouter.get("/:id", getRfqByIdController);
rfqRouter.put("/:id", updateRfqController);

export default rfqRouter;