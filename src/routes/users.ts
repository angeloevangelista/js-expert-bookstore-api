import { Router } from "express";

import { createUser, getUser, listUsers } from "../controllers/users";

const usersRouter = Router();

// POST /api/users
// GET /api/users/:id OK

// GET /api/users
// PUT /api/users/:id
// DELETE /api/users/:id

usersRouter.post("/api/users", createUser);
usersRouter.get("/api/users", listUsers);
usersRouter.get("/api/users/:user_id", getUser);

export default usersRouter;
