import httpStatus from "http-status";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError.js";
import prisma from "../../lib/prisma.js";

type TUserQuery = {
  page?: string;
  limit?: string;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
};

const getAllUsers = async (query: TUserQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (query.search) {
    andConditions.push({
      OR: [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
      ],
    });
  }

  if (query.role) {
    andConditions.push({ role: query.role });
  }

  if (query.status) {
    andConditions.push({ status: query.status });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const updateUserStatus = async (adminId: string, userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.id === adminId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot update your own status");
  }

  if (user.role === UserRole.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Admin user status cannot be changed");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return result;
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
};