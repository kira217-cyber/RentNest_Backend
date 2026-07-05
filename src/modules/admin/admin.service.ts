import httpStatus from "http-status";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { PaymentStatus, PropertyStatus, RentalStatus } from "@prisma/client";
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

type TAdminPropertyQuery = {
  page?: string;
  limit?: string;
  search?: string;
  location?: string;
  categoryId?: string;
  status?: string;
  landlordId?: string;
};

const getAllProperties = async (query: TAdminPropertyQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (query.search) {
    andConditions.push({
      OR: [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { location: { contains: query.search, mode: "insensitive" } },
      ],
    });
  }

  if (query.location) {
    andConditions.push({
      location: { contains: query.location, mode: "insensitive" },
    });
  }

  if (query.categoryId) andConditions.push({ categoryId: query.categoryId });

  if (query.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  if (query.landlordId) andConditions.push({ landlordId: query.landlordId });

  const whereConditions: Prisma.PropertyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        _count: {
          select: {
            rentalRequests: true,
            reviews: true,
          },
        },
      },
    }),
    prisma.property.count({ where: whereConditions }),
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

const getSingleProperty = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
        },
      },
      rentalRequests: {
        include: {
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
        orderBy: { createdAt: "desc" },
      },
      reviews: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  return property;
};

type TAdminRentalQuery = {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  tenantId?: string;
  propertyId?: string;
};

const getAllRentals = async (query: TAdminRentalQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.RentalRequestWhereInput[] = [];

  if (query.search) {
    andConditions.push({
      OR: [
        {
          tenant: {
            name: { contains: query.search, mode: "insensitive" },
          },
        },
        {
          tenant: {
            email: { contains: query.search, mode: "insensitive" },
          },
        },
        {
          property: {
            title: { contains: query.search, mode: "insensitive" },
          },
        },
        {
          property: {
            location: { contains: query.search, mode: "insensitive" },
          },
        },
      ],
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  if (query.tenantId) {
    andConditions.push({
      tenantId: query.tenantId,
    });
  }

  if (query.propertyId) {
    andConditions.push({
      propertyId: query.propertyId,
    });
  }

  const whereConditions: Prisma.RentalRequestWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [data, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where: whereConditions,
      skip,
      take: limit,
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
            status: true,
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
                status: true,
              },
            },
          },
        },
        payment: true,
      },
    }),

    prisma.rentalRequest.count({
      where: whereConditions,
    }),
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

const getSingleRental = async (id: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          photo: true,
          status: true,
          createdAt: true,
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
              photo: true,
              status: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  return rental;
};

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalTenants,
    totalLandlords,
    totalProperties,
    availableProperties,
    rentedProperties,
    totalRentals,
    pendingRentals,
    approvedRentals,
    activeRentals,
    completedRentals,
    totalPayments,
    completedPayments,
    revenueResult,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: UserRole.TENANT } }),
    prisma.user.count({ where: { role: UserRole.LANDLORD } }),

    prisma.property.count(),
    prisma.property.count({ where: { status: PropertyStatus.AVAILABLE } }),
    prisma.property.count({ where: { status: PropertyStatus.RENTED } }),

    prisma.rentalRequest.count(),
    prisma.rentalRequest.count({ where: { status: RentalStatus.PENDING } }),
    prisma.rentalRequest.count({ where: { status: RentalStatus.APPROVED } }),
    prisma.rentalRequest.count({ where: { status: RentalStatus.ACTIVE } }),
    prisma.rentalRequest.count({ where: { status: RentalStatus.COMPLETED } }),

    prisma.payment.count(),
    prisma.payment.count({ where: { status: PaymentStatus.COMPLETED } }),

    prisma.payment.aggregate({
      where: { status: PaymentStatus.COMPLETED },
      _sum: { amount: true },
    }),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  const recentRentals = await prisma.rentalRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
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
          price: true,
        },
      },
      payment: true,
    },
  });

  return {
    overview: {
      totalUsers,
      totalTenants,
      totalLandlords,
      totalProperties,
      availableProperties,
      rentedProperties,
      totalRentals,
      pendingRentals,
      approvedRentals,
      activeRentals,
      completedRentals,
      totalPayments,
      completedPayments,
      totalRevenue: Number(revenueResult._sum.amount || 0),
    },
    recentUsers,
    recentRentals,
  };
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getSingleProperty,
  getAllRentals,
  getSingleRental,
  getDashboardStats,
};