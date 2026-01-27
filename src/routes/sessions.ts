import { Router } from "express";

import { createSession } from "../controllers/sessions.js";

const sessionsRouter = Router();

sessionsRouter.post("/api/sessions", createSession);

export default sessionsRouter;
