import cors from "cors";
import express, { type Application, type Request, type Response } from "express";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import router from "./routes/index.js";

const app: Application = express();

app.use(cors());
app.use(cookieParser());

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "RentNest API is running successfully",
  });
});

app.use("/api", router);


app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API route not found",
    errorDetails: [
      {
        path: req.originalUrl,
        message: `Cannot ${req.method} ${req.originalUrl}`,
      },
    ],
  });
});

app.use(globalErrorHandler);

export default app;