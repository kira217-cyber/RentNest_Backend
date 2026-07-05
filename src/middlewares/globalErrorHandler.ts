import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config/index.js";
import AppError from "../errors/AppError.js";
import type { TErrorSource } from "../interfaces/error.js";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: TErrorSource[] = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";

    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    errorDetails = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;

    errorDetails = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack: config.nodeEnv === "development" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;