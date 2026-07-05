import httpStatus from "http-status";
import { PaymentStatus, RentalStatus } from "@prisma/client";
import AppError from "../../errors/AppError.js";
import prisma from "../../lib/prisma.js";

type TCreateReviewPayload = {
  propertyId: string;
  rating: number;
  comment: string;
};

const createReview = async (tenantId: string, payload: TCreateReviewPayload) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  const completedOrActiveRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: {
        in: [RentalStatus.ACTIVE, RentalStatus.COMPLETED],
      },
      payment: {
        status: PaymentStatus.COMPLETED,
      },
    },
  });

  if (!completedOrActiveRental) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can review only after completed payment for this rental",
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId: payload.propertyId,
      },
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this property",
    );
  }

  const result = await prisma.review.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });

  return result;
};

const getPropertyReviews = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          photo: true,
        },
      },
    },
  });

  return reviews;
};

export const ReviewService = {
  createReview,
  getPropertyReviews,
};