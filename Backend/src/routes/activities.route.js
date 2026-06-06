import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getActivitiesController } from "../controller/activities.controller.js";

const activitiesRouter = Router();

activitiesRouter.use(verifyToken);
activitiesRouter.get("/", getActivitiesController);

export default activitiesRouter;
