import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getActiveVendorsController } from "../controller/vendor.controller.js";

const vendorRouter = Router();

// Secure vendor routes with auth verification
vendorRouter.use(verifyToken);

vendorRouter.get("/", getActiveVendorsController);

export default vendorRouter;
