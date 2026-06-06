import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  generatePoAndInvoice,
  getPurchaseOrders,
  getPoDetails,
} from "../controller/po.controller.js";

const poRouter = Router();

// Secure all purchase order endpoints
poRouter.use(verifyToken);

poRouter.post("/", generatePoAndInvoice);
poRouter.get("/", getPurchaseOrders);
poRouter.get("/:id", getPoDetails);

export default poRouter;
