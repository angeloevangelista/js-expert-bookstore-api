import * as zod from "zod";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import getPrismaClient from "../prisma/index.js";

export async function listBooks(request: Request, response: Response) {
  const prisma = getPrismaClient();

  const { include_author, include_category, include_publisher } = request.query;

  const books = await prisma.book.findMany({
    include: {
      author: Boolean(include_author)
        ? {
            omit: { password: true },
          }
        : false,
      publisher: Boolean(include_publisher),
      category: Boolean(include_category),
    },
  });

  return response.json(books);
}

export async function getBook(request: Request, response: Response) {
  const GetBookSchema = zod.object({
    book_id: zod.uuidv4({ error: "the book id must be a valid UUID" }),
  });

  const { success, error, data } = GetBookSchema.safeParse(request.params);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((issue) => issue.message) });
  }

  const { include_author, include_category, include_publisher } = request.query;

  const prisma = getPrismaClient();

  const book = await prisma.book.findUnique({
    where: {
      id: data.book_id,
    },
    include: {
      author: Boolean(include_author)
        ? {
            omit: { password: true },
          }
        : false,
      publisher: Boolean(include_publisher),
      category: Boolean(include_category),
    },
  });

  if (!book) {
    return response.status(404).json({
      errors: ["book not found"],
    });
  }

  return response.json(book);
}

export async function createBook(request: Request, response: Response) {
  const CreateBookSchema = zod.object({
    title: zod
      .string()
      .min(1, { error: "the book title must have at least 1 character" })
      .max(56, { error: "the book title must have less than 56 characters" }),
    summary: zod
      .string()
      .min(1, { error: "the book summary must have at least 1 character" })
      .max(255, {
        error: "the book summary must have less than 255 characters",
      }),
    year: zod
      .number()
      .int({ error: "the year must be an integer" })
      .min(1000, { error: "the year must be at least 1000" })
      .max(new Date().getFullYear(), {
        error: "the year cannot be in the future",
      }),
    pages: zod
      .number()
      .int({ error: "the number of pages must be an integer" })
      .min(1, { error: "the book must have at least 1 page" }),
    isbn: zod
      .string()
      .length(13, { error: "the ISBN must be exactly 13 characters" })
      .regex(/^\d{13}$/, {
        error: "the ISBN must consist of exactly 13 digits",
      }),
    author_id: zod.uuidv4({ error: "the author id must be a valid UUID" }),
    publisher_id: zod.uuidv4({
      error: "the publisher id must be a valid UUID",
    }),
    category_id: zod.uuidv4({ error: "the category id must be a valid UUID" }),
  });

  const { success, error, data } = CreateBookSchema.safeParse(request.body);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((issue) => issue.message) });
  }

  const prisma = getPrismaClient();

  const existingBook = await prisma.book.findUnique({
    where: {
      isbn: data.isbn,
    },
  });

  if (existingBook) {
    return response.status(400).json({
      errors: ["ISBN is already in use"],
    });
  }

  const author = await prisma.user.findUnique({
    where: { id: data.author_id },
  });

  if (!author) {
    return response.status(400).json({
      errors: ["author not found"],
    });
  }

  const publisher = await prisma.publisher.findUnique({
    where: { id: data.publisher_id },
  });

  if (!publisher) {
    return response.status(400).json({
      errors: ["publisher not found"],
    });
  }

  const category = await prisma.category.findUnique({
    where: { id: data.category_id },
  });

  if (!category) {
    return response.status(400).json({
      errors: ["category not found"],
    });
  }

  const book = await prisma.book.create({
    data: {
      title: data.title,
      summary: data.summary,
      year: data.year,
      pages: data.pages,
      isbn: data.isbn,
      author_id: data.author_id,
      publisher_id: data.publisher_id,
      category_id: data.category_id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      },
      publisher: {
        select: {
          id: true,
          name: true,
          address: true,
          cellphone: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return response.status(201).json(book);
}

export async function updateBook(request: Request, response: Response) {
  const BookIdSchema = zod.uuidv4({
    error: "the book id must be a valid UUID",
  });

  const {
    success: bookIdSuccess,
    error: bookIdError,
    data: bookId,
  } = BookIdSchema.safeParse(request.params.book_id);

  if (!bookIdSuccess) {
    return response
      .status(400)
      .json({ errors: bookIdError.issues.map((issue) => issue.message) });
  }

  const UpdateBookSchema = zod.object({
    title: zod
      .string()
      .min(1, { error: "the book title must have at least 1 character" })
      .max(56, { error: "the book title must have less than 56 characters" }),
    summary: zod
      .string()
      .min(1, { error: "the book summary must have at least 1 character" })
      .max(255, {
        error: "the book summary must have less than 255 characters",
      }),
    year: zod
      .number()
      .int({ error: "the year must be an integer" })
      .min(1000, { error: "the year must be at least 1000" })
      .max(new Date().getFullYear(), {
        error: "the year cannot be in the future",
      }),
    pages: zod
      .number()
      .int({ error: "the number of pages must be an integer" })
      .min(1, { error: "the book must have at least 1 page" }),
    isbn: zod
      .string()
      .length(13, { error: "the ISBN must be exactly 13 characters" })
      .regex(/^\d{13}$/, {
        error: "the ISBN must consist of exactly 13 digits",
      }),
    author_id: zod.uuidv4({ error: "the author id must be a valid UUID" }),
    publisher_id: zod.uuidv4({
      error: "the publisher id must be a valid UUID",
    }),
    category_id: zod.uuidv4({ error: "the category id must be a valid UUID" }),
  });

  const {
    success: payloadSuccess,
    error: payloadError,
    data: bookPayload,
  } = UpdateBookSchema.safeParse(request.body);

  if (!payloadSuccess) {
    return response.status(400).json({
      errors: payloadError.issues.map((issue) => issue.message),
    });
  }

  const prisma = getPrismaClient();

  const foundBook = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!foundBook) {
    return response.status(404).json({
      errors: ["book not found"],
    });
  }

  if (bookPayload.isbn && bookPayload.isbn !== foundBook.isbn) {
    const existingBook = await prisma.book.findUnique({
      where: { isbn: bookPayload.isbn },
    });

    if (existingBook) {
      return response.status(400).json({
        errors: ["new ISBN is already in use"],
      });
    }
  }

  if (bookPayload.author_id && bookPayload.author_id !== foundBook.author_id) {
    const author = await prisma.user.findUnique({
      where: { id: bookPayload.author_id },
    });

    if (!author) {
      return response.status(400).json({
        errors: ["author not found"],
      });
    }
  }

  if (
    bookPayload.publisher_id &&
    bookPayload.publisher_id !== foundBook.publisher_id
  ) {
    const publisher = await prisma.publisher.findUnique({
      where: { id: bookPayload.publisher_id },
    });

    if (!publisher) {
      return response.status(400).json({
        errors: ["publisher not found"],
      });
    }
  }

  if (
    bookPayload.category_id &&
    bookPayload.category_id !== foundBook.category_id
  ) {
    const category = await prisma.category.findUnique({
      where: { id: bookPayload.category_id },
    });

    if (!category) {
      return response.status(400).json({
        errors: ["category not found"],
      });
    }
  }

  const updatedBook = await prisma.book.update({
    where: {
      id: bookId,
    },
    data: bookPayload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      publisher: true,
      category: true,
    },
  });

  return response.status(200).json(updatedBook);
}

export async function deleteBook(request: Request, response: Response) {
  const {
    success,
    error,
    data: bookId,
  } = zod
    .uuidv4({ error: "the book id must be a valid UUID" })
    .safeParse(request.params.book_id);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((issue) => issue.message) });
  }

  const prisma = getPrismaClient();

  const foundBook = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!foundBook) {
    return response.status(404).json({
      errors: ["book not found"],
    });
  }

  await prisma.book.delete({
    where: {
      id: bookId,
    },
  });

  return response.status(204).send();
}
