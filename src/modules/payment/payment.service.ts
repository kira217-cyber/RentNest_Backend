import httpStatus from "http-status";
import Stripe from "stripe";
import { PaymentProvider, PaymentStatus, RentalStatus } from "@prisma/client";
import config from "../../config/index.js";
import AppError from "../../errors/AppError.js";
import prisma from "../../lib/prisma.js";

if (!config.stripe.secretKey) {
  console.warn(
    "STRIPE_SECRET_KEY is missing. Payment create API will not work.",
  );
}

const stripe = new Stripe(config.stripe.secretKey || "missing_key");

type TCreatePaymentPayload = {
  rentalRequestId: string;
};

const createPaymentSession = async (
  tenantId: string,
  payload: TCreatePaymentPayload,
) => {
  if (!config.stripe.secretKey) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Stripe secret key is not configured",
    );
  }

  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: payload.rentalRequestId,
    },
    include: {
      property: true,
      payment: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.tenantId !== tenantId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only pay for your own rental request",
    );
  }

  if (rental.status !== RentalStatus.APPROVED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental request must be approved before payment",
    );
  }

  if (rental.payment?.status === PaymentStatus.COMPLETED) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Payment already completed for this rental request",
    );
  }

  const amount = Number(rental.property.price);

  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment amount");
  }

  const payment = await prisma.payment.upsert({
    where: {
      rentalRequestId: rental.id,
    },
    update: {
      amount,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
    },
    create: {
      rentalRequestId: rental.id,
      amount,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: rental.tenant.email,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: rental.property.title,
            description: `RentNest rental payment for ${rental.property.location}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      paymentId: payment.id,
      rentalRequestId: rental.id,
      tenantId,
      propertyId: rental.propertyId,
    },
    success_url: `${config.client.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:
      config.client.cancelUrl || "http://localhost:3000/payment/cancel",
  });

  const updatedPayment = await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      stripeSessionId: session.id,
      metadata: {
        checkoutUrl: session.url,
      },
    },
  });

  return {
    payment: updatedPayment,
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const confirmPaymentBySession = async (sessionId: string) => {
  if (!config.stripe.secretKey) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Stripe secret key is not configured",
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const payment = await prisma.payment.findUnique({
    where: {
      stripeSessionId: session.id,
    },
    include: {
      rentalRequest: true,
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.status === PaymentStatus.COMPLETED) {
    return payment;
  }

  if (session.payment_status !== "paid") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment is not completed yet");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId: session.payment_intent?.toString(),
        paymentIntentId: session.payment_intent?.toString(),
        paidAt: new Date(),
        metadata: session as unknown as object,
      },
    });

    await tx.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: {
        status: RentalStatus.ACTIVE,
      },
    });

    await tx.property.update({
      where: { id: payment.rentalRequest.propertyId },
      data: {
        status: "RENTED",
      },
    });

    return updatedPayment;
  });

  return result;
};

const handleStripeWebhook = async (
  body: Buffer,
  signature: string | undefined,
) => {
  if (!config.stripe.webhookSecret) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Stripe webhook secret is not configured",
    );
  }

  if (!signature) {
    throw new AppError(httpStatus.BAD_REQUEST, "Stripe signature is missing");
  }

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    config.stripe.webhookSecret,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.id) {
      await confirmPaymentBySession(session.id);
    }
  }

  return {
    received: true,
    eventType: event.type,
  };
};

const getMyPayments = async (userId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      rentalRequest: {
        include: {
          property: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const getSinglePayment = async (
  userId: string,
  userRole: string,
  paymentId: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      rentalRequest: {
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
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  const isTenant = payment.rentalRequest.tenantId === userId;
  const isLandlord = payment.rentalRequest.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to view this payment",
    );
  }

  return payment;
};

export const PaymentService = {
  createPaymentSession,
  confirmPaymentBySession,
  handleStripeWebhook,
  getMyPayments,
  getSinglePayment,
};
