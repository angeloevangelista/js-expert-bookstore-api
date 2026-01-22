import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "../controllers/books";

const booksRouter = Router();

booksRouter.get("/api/books", listBooks);
booksRouter.get("/api/books/:book_id", getBook);
booksRouter.post("/api/books", createBook);
booksRouter.put("/api/books/:book_id", updateBook);
booksRouter.delete("/api/books/:book_id", deleteBook);

export default booksRouter;
