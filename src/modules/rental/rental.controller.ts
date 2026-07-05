import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { RentalService } from "./rental.service.js";

const getParamId = (id: unknown): string => {
  if (typeof id !== "string" || !id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rental request id is required");
  }

  return id;
};

const createRentalRequest = catchAsync(async (req, res) => {
  const result = await RentalService.createRentalRequest(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getMyRentalRequests = catchAsync(async (req, res) => {
  const result = await RentalService.getMyRentalRequests(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const getSingleRentalRequest = catchAsync(async (req, res) => {
  const id = getParamId(req.params.id);

  const result = await RentalService.getSingleRentalRequest(
    req.user!.id,
    req.user!.role,
    id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental request retrieved successfully",
    data: result,
  });
});

const getLandlordRentalRequests = catchAsync(async (req, res) => {
  const result = await RentalService.getLandlordRentalRequests(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Landlord rental requests retrieved successfully",
    data: result,
  });
});

const updateRentalRequestStatus = catchAsync(async (req, res) => {
  const id = getParamId(req.params.id);

  const result = await RentalService.updateRentalRequestStatus(
    req.user!.id,
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental request status updated successfully",
    data: result,
  });
});

export const RentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
};