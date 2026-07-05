import httpStatus from "http-status";
import { Prisma, PropertyStatus } from "@prisma/client";
import AppError from "../../errors/AppError.js";
import prisma from "../../lib/prisma.js";

type TCreatePropertyPayload = {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  amenities?: string[];
  images?: string[];
  categoryId: string;
  status?: PropertyStatus;
  isPublished?: boolean;
};

type TUpdatePropertyPayload = Partial<TCreatePropertyPayload>;

type TPropertyQuery = {
  page?: string;
  limit?: string;
  search?: string;
  location?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  status?: PropertyStatus;
};

const createProperty = async (
  landlordId: string,
  payload: TCreatePropertyPayload,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (!category.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category is not active");
  }

  const result = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      price: payload.price,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      area: payload.area,
      amenities: payload.amenities ?? [],
      images: payload.images ?? [],
      categoryId: payload.categoryId,
      landlordId,
      status: payload.status ?? PropertyStatus.AVAILABLE,
      isPublished: payload.isPublished ?? true,
    },
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
  });

  return result;
};

const getAllProperties = async (query: TPropertyQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.PropertyWhereInput[] = [
    {
      isPublished: true,
    },
  ];

  if (query.search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location,
        mode: "insensitive",
      },
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  if (query.bedrooms) {
    andConditions.push({
      bedrooms: Number(query.bedrooms),
    });
  }

  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      price: {
        gte: query.minPrice ? Number(query.minPrice) : undefined,
        lte: query.maxPrice ? Number(query.maxPrice) : undefined,
      },
    });
  }

  const whereConditions: Prisma.PropertyWhereInput = {
    AND: andConditions,
  };

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
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
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            tenant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),

    prisma.property.count({
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

const getSingleProperty = async (id: string) => {
  const result = await prisma.property.findFirst({
    where: {
      id,
      isPublished: true,
    },
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
      rentalRequests: {
        select: {
          id: true,
          status: true,
          moveInDate: true,
          moveOutDate: true,
          createdAt: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  return result;
};

const getMyProperties = async (landlordId: string) => {
  const result = await prisma.property.findMany({
    where: {
      landlordId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      rentalRequests: {
        select: {
          id: true,
          status: true,
          moveInDate: true,
          createdAt: true,
        },
      },
    },
  });

  return result;
};

const updateProperty = async (
  landlordId: string,
  id: string,
  payload: TUpdatePropertyPayload,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can update only your own property",
    );
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    if (!category.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category is not active");
    }
  }

  const result = await prisma.property.update({
    where: {
      id,
    },
    data: payload,
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
  });

  return result;
};

const deleteProperty = async (landlordId: string, id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can delete only your own property",
    );
  }

  const activeRental = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: id,
      status: {
        in: ["PENDING", "APPROVED", "ACTIVE"],
      },
    },
  });

  if (activeRental) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This property has active rental requests and cannot be deleted",
    );
  }

  const result = await prisma.property.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
};
