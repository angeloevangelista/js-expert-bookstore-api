import * as zod from "zod";
import { Request, Response } from "express";

import getPrismaClient from "../prisma";

export async function listPublishers(request: Request, response: Response) {
  const prisma = getPrismaClient();

  const publishers = await prisma.publisher.findMany({});

  return response.json(publishers);
}

export async function createPublisher(request: Request, response: Response) {
  const CreatePublisherSchema = zod.object({
    name: zod
      .string()
      .min(2, { error: "the publisher name must have at least 2 characters" })
      .max(32, {
        error: "the publisher name must have less than 32 characters",
      }),
    address: zod
      .string()
      .min(1, { error: "the address is required" })
      .max(255, {
        error: "the address must have less than 255 characters",
      }),
    cellphone: zod
      .string()
      .min(1, { error: "the cellphone is required" })
      .max(24, {
        error: "the cellphone must have less than 24 characters",
      }),
  });

  const { success, error, data } = CreatePublisherSchema.safeParse(
    request.body,
  );

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((p) => p.message) });
  }

  const prisma = getPrismaClient();

  const existingPublisher = await prisma.publisher.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: "insensitive",
      },
    },
  });

  if (existingPublisher) {
    return response.status(400).json({
      errors: ["publisher already exists"],
    });
  }

  const publisher = await prisma.publisher.create({
    data: {
      name: data.name,
      address: data.address,
      cellphone: data.cellphone,
    },
  });

  return response.status(201).json(publisher);
}

export async function deletePublisher(request: Request, response: Response) {
  const {
    success,
    error,
    data: publisherId,
  } = zod
    .uuidv4({ error: "the publisher id must be a valid UUID" })
    .safeParse(request.params.publisher_id);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((p) => p.message) });
  }

  const prisma = getPrismaClient();

  const foundPublisher = await prisma.publisher.findUnique({
    where: {
      id: publisherId,
    },
    include: {
      books: true,
    },
  });

  if (!foundPublisher) {
    return response.status(404).json({
      errors: ["publisher not found"],
    });
  }

  if (foundPublisher.books.length > 0) {
    return response.status(400).json({
      errors: [
        "you cannot delete a publisher that has books associated with it",
      ],
    });
  }

  await prisma.publisher.delete({
    where: {
      id: publisherId,
    },
  });

  return response.status(204).send();
}
