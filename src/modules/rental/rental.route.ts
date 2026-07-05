import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { RentalController } from "./rental.controller.js";
import { RentalValidation } from "./rental.validation.js";

const router = Router();

router.post(
  "/",
  auth(UserRole.TENANT),
  validateRequest(RentalValidation.createRentalValidationSchema),
  RentalController.createRentalRequest,
);

router.get("/", auth(UserRole.TENANT), RentalController.getMyRentalRequests);

router.get(
  "/landlord/requests",
  auth(UserRole.LANDLORD),
  RentalController.getLandlordRentalRequests,
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT),
  RentalController.getSingleRentalRequest,
);

router.patch(
  "/landlord/requests/:id",
  auth(UserRole.LANDLORD),
  validateRequest(RentalValidation.updateRentalStatusValidationSchema),
  RentalController.updateRentalRequestStatus,
);

export const RentalRoutes = router;
