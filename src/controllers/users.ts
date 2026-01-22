import * as zod from "zod";
import { Request, Response } from "express";

import getPrismaClient from "../prisma";

export async function listUsers(request: Request, response: Response) {
  const prisma = getPrismaClient();

  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });

  return response.json(users);
}

export async function getUser(request: Request, response: Response) {
  const GetUserSchema = zod.object({
    user_id: zod.uuidv4({ error: "the user id must be a valid UUID" }),
  });

  const { success, error, data } = GetUserSchema.safeParse(request.params);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((p) => p.message) });
  }

  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      id: data.user_id,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    return response.status(404).json({
      errors: ["user not found"],
    });
  }

  return response.json(user);
}

export async function createUser(request: Request, response: Response) {
  const CreateUserSchema = zod.object({
    name: zod
      .string()
      .min(2, { error: "the user name must have at least 2 characters" })
      .max(32, { error: "the user name must have less than 32 characters" }),
    surname: zod
      .string()
      .min(2, { error: "the surname must have at least 2 characters" })
      .max(40, { error: "the surname must have less than 40 characters" }),
    email: zod.email({ error: "the user email must be a valid email address" }),
    password: zod
      .string()
      .min(6, { error: "the user password must have at least 6 characters" }),
  });

  const { success, error, data } = CreateUserSchema.safeParse(request.body);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((p) => p.message) });
  }

  const prisma = getPrismaClient();

  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    return response.status(400).json({
      errors: ["email is already in use"],
    });
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
    },
    omit: {
      password: true,
    },
  });

  return response.status(201).json(user);
}

export async function updateUser(request: Request, response: Response) {
  const { data: userId, ...userIdValidation } = zod
    .uuidv4({ error: "the user id must be a valid UUID" })
    .safeParse(request.params.user_id);

  if (!userIdValidation.success) {
    return response
      .status(400)
      .json({ errors: userIdValidation.error.issues.map((p) => p.message) });
  }

  const UpdateUserSchema = zod.object({
    name: zod
      .string()
      .min(2, { error: "the user name must have at least 2 characters" })
      .max(32, { error: "the user name must have less than 32 characters" }),
    surname: zod
      .string()
      .min(2, { error: "the surname must have at least 2 characters" })
      .max(40, { error: "the surname must have less than 40 characters" }),
    email: zod.email({ error: "the user email must be a valid email address" }),
  });

  const { data: userPayload, ...userPayloadValidation } =
    UpdateUserSchema.safeParse(request.body);

  if (!userPayloadValidation.success) {
    return response.status(400).json({
      errors: userPayloadValidation.error.issues.map((p) => p.message),
    });
  }

  const prisma = getPrismaClient();

  const foundUser = await prisma.user.findUnique({
    where: { id: userId! },
  });

  if (!foundUser) {
    return response.status(404).json({
      errors: ["user was not found"],
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId!,
    },
    data: {
      name: userPayload!.name,
      surname: userPayload!.surname,
      email: userPayload!.email,
    },
    omit: {
      password: true,
    },
  });

  return response.status(200).json(updatedUser);
}

export async function deleteUser(request: Request, response: Response) {
  const {
    success,
    error,
    data: userId,
  } = zod
    .uuidv4({ error: "the user id must be a valid UUID" })
    .safeParse(request.params.user_id);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((p) => p.message) });
  }

  const prisma = getPrismaClient();

  const foundUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!foundUser) {
    return response.status(404).json({
      errors: ["user not found"],
    });
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return response.status(204).send();
}
