import * as zod from "zod";
import { Request, Response } from "express";

import getPrismaClient from "../prisma/index.js";

export async function listCategories(request: Request, response: Response) {
  const prisma = getPrismaClient();

  const categories = await prisma.category.findMany({});

  return response.json(categories);
}

export async function createCategory(request: Request, response: Response) {
  const CreateCategorySchema = zod.object({
    name: zod
      .string()
      .min(2, { error: "the category name must have at least 2 characters" })
      .max(32, {
        error: "the category name must have less than 32 characters",
      }),
  });

  const { success, error, data } = CreateCategorySchema.safeParse(request.body);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((p) => p.message) });
  }

  const prisma = getPrismaClient();

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: "insensitive",
      },
    },
  });

  if (existingCategory) {
    return response.status(400).json({
      errors: ["category already exists"],
    });
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
    },
  });

  return response.status(201).json(category);
}

export async function deleteCategory(request: Request, response: Response) {
  const {
    success,
    error,
    data: categoryId,
  } = zod
    .uuidv4({ error: "the category id must be a valid UUID" })
    .safeParse(request.params.category_id);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((p) => p.message) });
  }

  const prisma = getPrismaClient();

  const foundCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!foundCategory) {
    return response.status(404).json({
      errors: ["category not found"],
    });
  }

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return response.status(204).send();
}
