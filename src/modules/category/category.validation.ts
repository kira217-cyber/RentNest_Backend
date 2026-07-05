import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name cannot be more than 50 characters"),

    description: z
      .string()
      .trim()
      .max(300, "Description cannot be more than 300 characters")
      .optional(),

    isActive: z.boolean().optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name cannot be more than 50 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(300, "Description cannot be more than 300 characters")
      .optional(),

    isActive: z.boolean().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};