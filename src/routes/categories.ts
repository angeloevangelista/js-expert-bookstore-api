import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  listCategories,
} from "../controllers/categories";

const categoriesRouter = Router();

categoriesRouter.post("/api/categories", createCategory);
categoriesRouter.get("/api/categories", listCategories);
categoriesRouter.delete("/api/categories/:category_id", deleteCategory);

export default categoriesRouter;
