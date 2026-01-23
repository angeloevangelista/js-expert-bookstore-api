import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export default function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const accessToken = (request.headers.authorization ?? "").replace(
      "Bearer ",
      "",
    );

    if (!accessToken) {
      return response.status(401).json({
        errors: ["no token was provided"],
      });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET!, {});

    // request.tokenPayload = tokenPayload;

    next();
  } catch (error) {
    return response.status(401).json({ errors: ["unauthorized"] });
  }
}
