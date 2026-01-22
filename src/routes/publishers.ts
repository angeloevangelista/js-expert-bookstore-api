import { Router } from "express";
import {
  createPublisher,
  deletePublisher,
  listPublishers,
} from "../controllers/publishers";

const publishersRouter = Router();

publishersRouter.post("/api/publishers", createPublisher);
publishersRouter.get("/api/publishers", listPublishers);
publishersRouter.delete("/api/publishers/:publisher_id", deletePublisher);

export default publishersRouter;
