import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    propertyId: z.string().min(1, "Property id is required"),

    rating: z
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),

    comment: z
      .string()
      .trim()
      .min(5, "Comment must be at least 5 characters")
      .max(500, "Comment cannot be more than 500 characters"),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};