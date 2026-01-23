import * as zod from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import getPrismaClient from "../prisma";

export async function createSession(request: Request, response: Response) {
  const CreateSessionSchema = zod.object({
    email: zod.email({ error: "provide a valid email" }),
    password: zod.string({ error: "provide a valid format for the password" }),
  });

  const { success, error, data } = CreateSessionSchema.safeParse(request.body);

  if (!success) {
    return response
      .status(400)
      .json({ errors: error.issues.map((p) => p.message) });
  }

  const prisma = getPrismaClient();

  const foundUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!foundUser) {
    return response
      .status(401)
      .json({ errors: ["user/password combination does not match"] });
  }

  const passwordsMatch = await bcrypt.compare(
    data.password,
    foundUser.password,
  );

  if (!passwordsMatch) {
    return response
      .status(401)
      .json({ errors: ["user/password combination does not match"] });
  }

  const accessToken = jwt.sign(
    {
      name: foundUser.name,
      email: foundUser.email,
    },
    process.env.JWT_SECRET!,
    {
      issuer: foundUser.id,
      expiresIn: "1m",
    },
  );

  return response.status(201).json({
    access_token: accessToken,
  });
}
