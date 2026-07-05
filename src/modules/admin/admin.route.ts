import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AdminController } from "./admin.controller.js";
import { AdminValidation } from "./admin.validation.js";

const router = Router();

router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);

router.patch(
  "/users/:id/status",
  auth(UserRole.ADMIN),
  validateRequest(AdminValidation.updateUserStatusValidationSchema),
  AdminController.updateUserStatus,
);

router.get(
  "/properties",
  auth(UserRole.ADMIN),
  AdminController.getAllProperties,
);

router.get(
  "/properties/:id",
  auth(UserRole.ADMIN),
  AdminController.getSingleProperty,
);

router.get(
  "/rentals",
  auth(UserRole.ADMIN),
  AdminController.getAllRentals,
);

router.get(
  "/rentals/:id",
  auth(UserRole.ADMIN),
  AdminController.getSingleRental,
);

router.get(
  "/dashboard",
  auth(UserRole.ADMIN),
  AdminController.getDashboardStats,
);

export const AdminRoutes = router;