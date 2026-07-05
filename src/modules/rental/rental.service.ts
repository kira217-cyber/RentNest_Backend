import httpStatus from "http-status";
import { RentalStatus } from "@prisma/client";
import AppError from "../../errors/AppError.js";
import prisma from "../../lib/prisma.js";

type TCreateRentalPayload = {
  propertyId: string;
  moveInDate: string;
  moveOutDate?: string;
  message?: string;
};

type TUpdateRentalStatusPayload = {
  status: "APPROVED" | "REJECTED";
  landlordNote?: string;
};

const createRentalRequest = async (
  tenantId: string,
  payload: TCreateRentalPayload,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (!property.isPublished) {
    throw new AppError(httpStatus.BAD_REQUEST, "Property is not published");
  }

  if (property.status !== "AVAILABLE") {
    throw new AppError(httpStatus.BAD_REQUEST, "Property is not available");
  }

  if (property.landlordId === tenantId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot request your own property",
    );
  }

  const moveInDate = new Date(payload.moveInDate);
  const moveOutDate = payload.moveOutDate ? new Date(payload.moveOutDate) : null;

  if (moveInDate <= new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Move-in date must be future date");
  }

  if (moveOutDate && moveOutDate <= moveInDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Move-out date must be after move-in date",
    );
  }

  const existingPendingOrApproved = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: {
        in: [RentalStatus.PENDING, RentalStatus.APPROVED, RentalStatus.ACTIVE],
      },
    },
  });

  if (existingPendingOrApproved) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You already have an active rental request for this property",
    );
  }

  const result = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      moveInDate,
      moveOutDate,
      message: payload.message,
    },
    include: {
      property: {
        include: {
          category: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      payment: true,
    },
  });

  return result;
};

const getMyRentalRequests = async (tenantId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      property: {
        include: {
          category: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  return result;
};

const getSingleRentalRequest = async (
  userId: string,
  userRole: string,
  rentalId: string,
) => {
  const result = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          category: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  const isTenant = result.tenantId === userId;
  const isLandlord = result.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to view this rental request",
    );
  }

  return result;
};

const getLandlordRentalRequests = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          category: true,
        },
      },
      payment: true,
    },
  });

  return result;
};

const updateRentalRequestStatus = async (
  landlordId: string,
  rentalId: string,
  payload: TUpdateRentalStatusPayload,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      property: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.property.landlordId !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can update only your own property rental requests",
    );
  }

  if (rental.status !== RentalStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending rental requests can be updated",
    );
  }

  const result = await prisma.rentalRequest.update({
    where: {
      id: rentalId,
    },
    data: {
      status: payload.status,
      landlordNote: payload.landlordNote,
      approvedAt: payload.status === "APPROVED" ? new Date() : undefined,
      rejectedAt: payload.status === "REJECTED" ? new Date() : undefined,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          category: true,
        },
      },
      payment: true,
    },
  });

  return result;
};

export const RentalService = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
};