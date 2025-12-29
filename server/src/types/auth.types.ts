import { Request } from "express";
import { JwtPayload as JsonWebTokenPayload } from "jsonwebtoken";

export interface JwtPayload extends JsonWebTokenPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
