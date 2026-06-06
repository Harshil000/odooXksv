import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getInvoices,
  getInvoiceDetails,
} from "../controller/po.controller.js";

const invoiceRouter = Router();

// Secure all invoice endpoints
invoiceRouter.use(verifyToken);

invoiceRouter.get("/", getInvoices);
invoiceRouter.get("/:id", getInvoiceDetails);

export default invoiceRouter;
