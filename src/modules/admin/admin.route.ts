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

export const AdminRoutes = router;