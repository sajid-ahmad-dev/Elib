import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  const parsedToken = token.split(" ")[1];

  try {
    const decodedToken = verify(parsedToken, config.jwtSecret as string);
    const _req = req as AuthRequest;
    _req.userId = decodedToken.sub as string;
    next();
  } catch (err) {
    // Pass the error to the global error handler
    next(err instanceof Error ? err : createHttpError(500, "Server error"));
  }
};

export default authenticate;
