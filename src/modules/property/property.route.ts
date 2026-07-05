import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { PropertyController } from "./property.controller.js";
import { PropertyValidation } from "./property.validation.js";

const router = Router();

router.get("/", PropertyController.getAllProperties);

router.get(
  "/my-properties",
  auth(UserRole.LANDLORD),
  PropertyController.getMyProperties,
);

router.get("/:id", PropertyController.getSingleProperty);

router.post(
  "/",
  auth(UserRole.LANDLORD),
  validateRequest(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty,
);

router.patch(
  "/:id",
  auth(UserRole.LANDLORD),
  validateRequest(PropertyValidation.updatePropertyValidationSchema),
  PropertyController.updateProperty,
);

router.delete(
  "/:id",
  auth(UserRole.LANDLORD),
  PropertyController.deleteProperty,
);

export const PropertyRoutes = router;