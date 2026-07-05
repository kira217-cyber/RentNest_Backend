import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import prisma from "../../lib/prisma.js";

type TCreateCategoryPayload = {
  name: string;
  description?: string;
  isActive?: boolean;
};

type TUpdateCategoryPayload = {
  name?: string;
  description?: string;
  isActive?: boolean;
};

const createCategory = async (payload: TCreateCategoryPayload) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isCategoryExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category already exists with this name",
    );
  }

  const result = await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description,
      isActive: payload.isActive ?? true,
    },
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleCategory = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return result;
};

const updateCategory = async (id: string, payload: TUpdateCategoryPayload) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (payload.name && payload.name !== category.name) {
    const isNameExist = await prisma.category.findUnique({
      where: {
        name: payload.name,
      },
    });

    if (isNameExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Category already exists with this name",
      );
    }
  }

  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const propertyCount = await prisma.property.count({
    where: {
      categoryId: id,
    },
  });

  if (propertyCount > 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This category is already used by properties and cannot be deleted",
    );
  }

  const result = await prisma.category.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};