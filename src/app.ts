import cors from "cors";
import express, { type Application, type Request, type Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "RentNest API is running successfully",
  });
});

app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API route not found",
    errorDetails: {
      path: req.originalUrl,
      method: req.method,
    },
  });
});

app.use(globalErrorHandler);

export default app;