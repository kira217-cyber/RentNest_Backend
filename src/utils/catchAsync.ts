import type { NextFunction, Request, Response } from "express";

type TAsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const catchAsync = (fn: TAsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;