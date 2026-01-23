import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "../controllers/users";
import authMiddleware from "../middlewares/auth-middleware";

const usersRouter = Router();

usersRouter.post("/api/users", createUser);

usersRouter.use(authMiddleware);

usersRouter.get("/api/users", listUsers);
usersRouter.get("/api/users/:user_id", getUser);
usersRouter.put("/api/users/:user_id", updateUser);
usersRouter.delete("/api/users/:user_id", deleteUser);

export default usersRouter;
