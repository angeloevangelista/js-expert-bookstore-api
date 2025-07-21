import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { AuthenticationError } from "../errors/errors";

function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    if (!request.headers.authorization) {
      throw new AuthenticationError("Token is missing");
    }

    const [_, token] = request.headers.authorization.split(" ");

    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET!);

    console.log({ tokenPayload });

    next();
  } catch (error) {
    console.error(`authentication error: ${(<Error>error).message}`);
    throw new AuthenticationError();
  }
}

export default ensureAuthentication;
