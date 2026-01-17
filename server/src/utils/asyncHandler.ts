import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | any>; // Allow return type to be void or any (e.g. Response)

/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to Express error middleware.
 *
 * Usage:
 * router.get('/path', asyncHandler(async (req, res) => {
 *   // async logic here - no try-catch needed
 * }));
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
