import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { CategoryRoutes } from "../modules/category/category.route.js";
import { PropertyRoutes } from "../modules/property/property.route.js";
import { RentalRoutes } from "../modules/rental/rental.route.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentNest API health check passed",
  });
});

router.use("/auth", AuthRoutes);
router.use("/categories", CategoryRoutes);
router.use("/properties", PropertyRoutes);
router.use("/rentals", RentalRoutes);

export default router;