import { Request, Response } from "express";

export function healthCheck(request: Request, response: Response) {
  return response.json({
    timestamp: new Date().toISOString(),
  });
}
