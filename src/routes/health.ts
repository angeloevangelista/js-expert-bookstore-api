import { Router } from "express";

import { healthCheck } from "../controllers/health.js";

const healthRouter = Router();

healthRouter.get("/api/health", healthCheck);

export default healthRouter;
