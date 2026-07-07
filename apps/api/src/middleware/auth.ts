import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./errorHandler";

interface JwtPayload {
  sub: string;
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = header.replace("Bearer ", "");
  const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  req.user = payload;
  next();
}
