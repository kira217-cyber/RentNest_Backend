import { z } from "zod";

const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot be more than 100 characters"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters"),

    location: z
      .string()
      .trim()
      .min(2, "Location is required"),

    price: z
      .number()
      .positive("Price must be greater than 0"),

    bedrooms: z
      .number()
      .int()
      .min(0, "Bedrooms cannot be negative"),

    bathrooms: z
      .number()
      .int()
      .min(0, "Bathrooms cannot be negative"),

    area: z.number().positive("Area must be greater than 0").optional(),

    amenities: z.array(z.string().trim()).optional().default([]),

    images: z.array(z.string().url("Image must be a valid URL")).optional().default([]),

    categoryId: z.string().min(1, "Category id is required"),

    status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]).optional(),

    isPublished: z.boolean().optional(),
  }),
});

const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot be more than 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .optional(),

    location: z.string().trim().min(2, "Location is required").optional(),

    price: z.number().positive("Price must be greater than 0").optional(),

    bedrooms: z.number().int().min(0, "Bedrooms cannot be negative").optional(),

    bathrooms: z.number().int().min(0, "Bathrooms cannot be negative").optional(),

    area: z.number().positive("Area must be greater than 0").optional(),

    amenities: z.array(z.string().trim()).optional(),

    images: z.array(z.string().url("Image must be a valid URL")).optional(),

    categoryId: z.string().min(1, "Category id is required").optional(),

    status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]).optional(),

    isPublished: z.boolean().optional(),
  }),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};