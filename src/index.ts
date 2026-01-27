import "dotenv/config";

import cors from "cors";
import crypto from "crypto";
import express, { NextFunction, Request, Response } from "express";

import healthRouter from "./routes/health.js";
import booksRouter from "./routes/books.js";
import usersRouter from "./routes/users.js";
import categoriesRouter from "./routes/categories.js";
import publishersRouter from "./routes/publishers.js";
import sessionsRouter from "./routes/sessions.js";
import authMiddleware from "./middlewares/auth-middleware.js";

const PORT = Number(process.env.PORT);

if (!PORT) {
  throw new Error("PORT env variable is not defined");
}

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.use(healthRouter);
app.use(sessionsRouter);
app.use(usersRouter);

app.use(authMiddleware);

app.use(categoriesRouter);
app.use(publishersRouter);
app.use(booksRouter);

const errors: { [key: string]: string } = {};

app.get("/api/logs/:log_id", (request, response) => {
  if (!errors[request.params.log_id!]) {
    return response.status(404).json({ errors: ["log not found"] });
  }

  return response.json([errors[request.params.log_id]]);
});

app.use(
  (error: any, request: Request, response: Response, next: NextFunction) => {
    const errorId = crypto.randomUUID();
    errors[errorId] = (<Error>error).message;

    return response.status(500).json({
      errors: [
        "internal server error",
        `provide this ID for the support team: ${errorId}`,
      ],
    });
  },
);

app.listen(PORT, () => {
  console.log(`server is listening at 0.0.0.0:${PORT}`);
});
