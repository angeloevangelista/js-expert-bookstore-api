import z from "zod";
import { BusinessError } from "../errors/errors";
import { PrismaClient, Book } from "../generated/prisma";

export const CreateBookSchema = z.object({
  author_id: z.string(),
  category_id: z.number(),
  publisher_id: z.string(),
  title: z.string().min(3).max(96),
  summary: z.string().min(10).max(1024),
  year: z.number().int().min(1000).max(9999),
  pages: z.number().int().min(1),
  isbn: z.string().length(13),
});

export const UpdateBookSchema = CreateBookSchema.partial();

class BookService {
  static async createBook(bookToCreate: Omit<Book, "id">): Promise<Book> {
    const prisma = new PrismaClient();

    const existingAuthor = await prisma.user.findUnique({
      where: {
        id: bookToCreate.author_id,
      },
    });

    if (!existingAuthor) {
      throw new BusinessError("Author with the provided ID does not exist");
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: bookToCreate.category_id,
      },
    });

    if (!existingCategory) {
      throw new BusinessError("Category with the provided ID does not exist");
    }

    const existingPublisher = await prisma.publisher.findUnique({
      where: {
        id: bookToCreate.publisher_id,
      },
    });

    if (!existingPublisher) {
      throw new BusinessError("Publisher with the provided ID does not exist");
    }

    const existingBook = await prisma.book.findUnique({
      where: {
        isbn: bookToCreate.isbn,
      },
    });

    if (existingBook) {
      throw new BusinessError("Book with this ISBN already exists");
    }

    const createdBook = await prisma.book.create({
      data: bookToCreate,
    });

    return createdBook;
  }

  static async listAllBooks(): Promise<Book[]> {
    const prisma = new PrismaClient({
      omit: {
        user: {
          password: true,
        },
      },
    });

    const allBooks = await prisma.book.findMany({
      include: {
        author: true,
        category: true,
        publisher: true,
      },
    });

    return allBooks;
  }

  static async getBookById(id: string): Promise<Book | null> {
    const prisma = new PrismaClient({
      omit: {
        user: { password: true },
      },
    });

    const foundBook = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        publisher: true,
      },
    });

    if (!foundBook) {
      throw new BusinessError("Book not found");
    }

    return foundBook;
  }

  static async updateBook(
    id: string,
    bookToUpdate: Partial<Omit<Book, "id">>
  ): Promise<Book | null> {
    const prisma = new PrismaClient();

    const existingBook = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!existingBook) {
      throw new BusinessError("Book not found");
    }

    const updatedBook = await prisma.book.update({
      where: {
        id,
      },
      data: bookToUpdate,
    });

    return updatedBook;
  }

  static async deleteBook(id: string): Promise<void> {
    const prisma = new PrismaClient();

    const existingBook = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!existingBook) {
      throw new BusinessError("Book not found");
    }

    await prisma.book.delete({
      where: {
        id,
      },
    });
  }
}

export default BookService;
