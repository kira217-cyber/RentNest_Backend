import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { CategoryRoutes } from "../modules/category/category.route.js";
import { PropertyRoutes } from "../modules/property/property.route.js";
import { RentalRoutes } from "../modules/rental/rental.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";
import { ReviewRoutes } from "../modules/review/review.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";

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
router.use("/payments", PaymentRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/admin", AdminRoutes);


export default router;