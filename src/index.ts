import "dotenv/config";

import express from "express";
import cors from "cors";

import userRouter from "./routes/user-router";
import healthRouter from "./routes/health-routes";
import categoryRouter from "./routes/category-router";
import publisherRouter from "./routes/publisher-router";
import bookRouter from "./routes/book-router";
import sessionRouter from "./routes/session-router";
import customErrorHandler from "./errors/error-handlers";
import requestLogger from "./middlewares/request-logger";
import ensureAuthentication from "./middlewares/ensure-authentication";

const port = process.env.PORT || 3333;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(requestLogger);
app.use(healthRouter);
app.use(sessionRouter);
app.use(userRouter);

app.use(ensureAuthentication);
app.use(categoryRouter);
app.use(publisherRouter);
app.use(bookRouter);

app.use(customErrorHandler);

app.listen(port, () => console.log(`server is listing at 0.0.0.0:${port}`));

// routes -> definir os endpoints do serviço
// controllers -> deserialização de body e validação de entrada
// services -> armazenar e proteger a regra de negócio
