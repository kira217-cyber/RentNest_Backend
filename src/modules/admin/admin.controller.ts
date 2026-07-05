import httpStatus from "http-status";
import { UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AdminService } from "./admin.service.js";

const getParamId = (id: unknown): string => {
  if (typeof id !== "string" || !id) {
    throw new AppError(httpStatus.BAD_REQUEST, "User id is required");
  }

  return id;
};

const getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const id = getParamId(req.params.id);

  const result = await AdminService.updateUserStatus(
    req.user!.id,
    id,
    req.body.status as UserStatus,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req, res) => {
  const result = await AdminService.getAllProperties(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin properties retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProperty = catchAsync(async (req, res) => {
  const id = getParamId(req.params.id);
  const result = await AdminService.getSingleProperty(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin property details retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getSingleProperty,
};