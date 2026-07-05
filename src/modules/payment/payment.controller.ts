import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PaymentService } from "./payment.service.js";

const getParamId = (id: unknown): string => {
  if (typeof id !== "string" || !id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment id is required");
  }

  return id;
};

const createPaymentSession = catchAsync(async (req, res) => {
  const result = await PaymentService.createPaymentSession(
    req.user!.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.confirmPaymentBySession(
    req.body.sessionId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const stripeWebhook = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"] as string | undefined;

  const result = await PaymentService.handleStripeWebhook(
    req.body as Buffer,
    signature,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe webhook received successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req, res) => {
  const result = await PaymentService.getMyPayments(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment history retrieved successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req, res) => {
  const id = getParamId(req.params.id);

  const result = await PaymentService.getSinglePayment(
    req.user!.id,
    req.user!.role,
    id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment details retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  createPaymentSession,
  confirmPayment,
  stripeWebhook,
  getMyPayments,
  getSinglePayment,
};
