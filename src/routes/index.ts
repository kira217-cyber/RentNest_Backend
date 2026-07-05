import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { CategoryRoutes } from "../modules/category/category.route.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentNest API health check passed",
  });
});

router.use("/auth", AuthRoutes);
router.use("/categories", CategoryRoutes);

export default router;