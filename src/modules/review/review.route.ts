import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { ReviewController } from "./review.controller.js";
import { ReviewValidation } from "./review.validation.js";

const router = Router();

router.post(
  "/",
  auth(UserRole.TENANT),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview,
);

router.get(
  "/property/:propertyId",
  ReviewController.getPropertyReviews,
);

export const ReviewRoutes = router;