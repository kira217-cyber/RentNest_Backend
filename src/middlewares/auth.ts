import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import type { UserRole } from "@prisma/client";
import config from "../config/index.js";
import AppError from "../errors/AppError.js";
import prisma from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";

type TJwtPayload = {
  id: string;
  email: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
    }
  }
}

const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const decoded = jwt.verify(token, config.jwt.secret) as TJwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.status === "BANNED") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is banned");
    }

    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  });
};

export default auth;