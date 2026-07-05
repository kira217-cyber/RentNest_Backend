import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ReviewService } from "./review.service.js";

const getParamId = (id: unknown): string => {
  if (typeof id !== "string" || !id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Property id is required");
  }

  return id;
};

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewService.createReview(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getPropertyReviews = catchAsync(async (req, res) => {
  const propertyId = getParamId(req.params.propertyId);
  const result = await ReviewService.getPropertyReviews(propertyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property reviews retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getPropertyReviews,
};