import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentNest API health check passed",
  });
});

router.use("/auth", AuthRoutes);

export default router;