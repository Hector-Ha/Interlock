import { Request } from "express";

// JWT token payload structure.
export interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
