import { Router } from "express";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";


const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser,
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.get("/me", auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT), AuthController.getMe);

export const AuthRoutes = router;