import { z } from "zod";

const createRentalValidationSchema = z.object({
  body: z.object({
    propertyId: z.string().min(1, "Property id is required"),

    moveInDate: z
      .string()
      .datetime("Move-in date must be a valid ISO datetime"),

    moveOutDate: z
      .string()
      .datetime("Move-out date must be a valid ISO datetime")
      .optional(),

    message: z
      .string()
      .trim()
      .max(500, "Message cannot be more than 500 characters")
      .optional(),
  }),
});

const updateRentalStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
      message: "Status must be APPROVED or REJECTED",
    }),

    landlordNote: z
      .string()
      .trim()
      .max(500, "Landlord note cannot be more than 500 characters")
      .optional(),
  }),
});

export const RentalValidation = {
  createRentalValidationSchema,
  updateRentalStatusValidationSchema,
};