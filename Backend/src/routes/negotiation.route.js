import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  submitNegotiation,
  getNegotiationThread,
} from "../controller/negotiation.controller.js";

const negotiationRouter = Router();

// Secure all endpoints
negotiationRouter.use(verifyToken);

negotiationRouter.post("/", submitNegotiation);
negotiationRouter.get("/quotation/:quotationId", getNegotiationThread);

export default negotiationRouter;
