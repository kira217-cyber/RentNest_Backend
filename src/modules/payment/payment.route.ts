import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { PaymentController } from "./payment.controller.js";
import { PaymentValidation } from "./payment.validation.js";

const router = Router();

router.post(
  "/create",
  auth(UserRole.TENANT),
  validateRequest(PaymentValidation.createPaymentValidationSchema),
  PaymentController.createPaymentSession,
);

router.post(
  "/confirm",
  auth(UserRole.TENANT),
  validateRequest(PaymentValidation.confirmPaymentValidationSchema),
  PaymentController.confirmPayment,
);

router.post("/webhook", PaymentController.stripeWebhook);

router.get(
  "/",
  auth(UserRole.TENANT),
  PaymentController.getMyPayments,
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.LANDLORD, UserRole.TENANT),
  PaymentController.getSinglePayment,
);

export const PaymentRoutes = router;