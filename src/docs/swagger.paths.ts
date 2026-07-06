export const swaggerPaths = {
  "/api/health": {
    get: {
      tags: ["Auth"],
      summary: "Health check",
      responses: {
        200: {
          description: "API health check passed",
        },
      },
    },
  },

  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register tenant or landlord",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              name: "Tenant User",
              email: "tenant@test.com",
              password: "123456",
              phone: "01711111111",
              role: "TENANT",
            },
          },
        },
      },
      responses: {
        201: { description: "User registered successfully" },
        400: { description: "Validation error" },
        409: { description: "User already exists" },
      },
    },
  },

  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              email: "admin@rentnest.com",
              password: "admin123",
            },
          },
        },
      },
      responses: {
        200: { description: "User logged in successfully" },
        401: { description: "Invalid credentials" },
      },
    },
  },

  "/api/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Get current user profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Profile retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/api/categories": {
    get: {
      tags: ["Categories"],
      summary: "Get all categories",
      responses: {
        200: { description: "Categories retrieved successfully" },
      },
    },
    post: {
      tags: ["Categories"],
      summary: "Create category - Admin only",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              name: "Apartment",
              description: "Apartment rental properties",
              isActive: true,
            },
          },
        },
      },
      responses: {
        201: { description: "Category created successfully" },
        403: { description: "Forbidden" },
      },
    },
  },

  "/api/categories/{id}": {
    get: {
      tags: ["Categories"],
      summary: "Get single category",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Category retrieved successfully" },
        404: { description: "Category not found" },
      },
    },
    patch: {
      tags: ["Categories"],
      summary: "Update category - Admin only",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              name: "Luxury Apartment",
              description: "Luxury apartment rental properties",
              isActive: true,
            },
          },
        },
      },
      responses: {
        200: { description: "Category updated successfully" },
      },
    },
    delete: {
      tags: ["Categories"],
      summary: "Delete category - Admin only",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Category deleted successfully" },
      },
    },
  },

  "/api/properties": {
    get: {
      tags: ["Properties"],
      summary: "Get all public properties with filters",
      parameters: [
        { name: "page", in: "query", schema: { type: "string" } },
        { name: "limit", in: "query", schema: { type: "string" } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "location", in: "query", schema: { type: "string" } },
        { name: "minPrice", in: "query", schema: { type: "string" } },
        { name: "maxPrice", in: "query", schema: { type: "string" } },
        { name: "categoryId", in: "query", schema: { type: "string" } },
        { name: "bedrooms", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Properties retrieved successfully" },
      },
    },
    post: {
      tags: ["Properties"],
      summary: "Create property - Landlord only",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              title: "Modern Apartment in Dhaka",
              description:
                "A beautiful modern apartment suitable for family living.",
              location: "Dhaka",
              price: 25000,
              bedrooms: 3,
              bathrooms: 2,
              area: 1200,
              amenities: ["WiFi", "Parking", "Lift"],
              images: ["https://example.com/apartment.jpg"],
              categoryId: "CATEGORY_ID",
              status: "AVAILABLE",
              isPublished: true,
            },
          },
        },
      },
      responses: {
        201: { description: "Property created successfully" },
      },
    },
  },
  "/api/properties/my-properties": {
    get: {
      tags: ["Properties"],
      summary: "Get landlord own properties",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "My properties retrieved successfully" },
      },
    },
  },

  "/api/properties/{id}": {
    get: {
      tags: ["Properties"],
      summary: "Get single public property",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Property retrieved successfully" },
        404: { description: "Property not found" },
      },
    },
    patch: {
      tags: ["Properties"],
      summary: "Update property - Landlord only",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              price: 27000,
              amenities: ["WiFi", "Parking", "Lift", "Generator"],
            },
          },
        },
      },
      responses: { 200: { description: "Property updated successfully" } },
    },
    delete: {
      tags: ["Properties"],
      summary: "Delete property - Landlord only",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Property deleted successfully" } },
    },
  },

  "/api/rentals": {
    post: {
      tags: ["Rentals"],
      summary: "Submit rental request - Tenant only",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              propertyId: "PROPERTY_ID",
              moveInDate: "2026-08-01T10:00:00.000Z",
              moveOutDate: "2026-12-01T10:00:00.000Z",
              message: "I am interested in renting this property.",
            },
          },
        },
      },
      responses: {
        201: { description: "Rental request submitted successfully" },
      },
    },
    get: {
      tags: ["Rentals"],
      summary: "Get tenant rental requests",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Rental requests retrieved successfully" },
      },
    },
  },

  "/api/rentals/{id}": {
    get: {
      tags: ["Rentals"],
      summary: "Get single rental request",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Rental request retrieved successfully" },
      },
    },
  },

  "/api/rentals/landlord/requests": {
    get: {
      tags: ["Rentals"],
      summary: "Get landlord rental requests",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Landlord rental requests retrieved successfully" },
      },
    },
  },

  "/api/rentals/landlord/requests/{id}": {
    patch: {
      tags: ["Rentals"],
      summary: "Approve or reject rental request - Landlord only",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              status: "APPROVED",
              landlordNote:
                "Your rental request has been approved. Please complete payment.",
            },
          },
        },
      },
      responses: {
        200: { description: "Rental request status updated successfully" },
      },
    },
  },

  "/api/payments/create": {
    post: {
      tags: ["Payments"],
      summary: "Create Stripe checkout session - Tenant only",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: { rentalRequestId: "APPROVED_RENTAL_REQUEST_ID" },
          },
        },
      },
      responses: {
        201: { description: "Payment session created successfully" },
      },
    },
  },

  "/api/payments/confirm": {
    post: {
      tags: ["Payments"],
      summary: "Confirm Stripe payment manually",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: { sessionId: "cs_test_xxxxx" },
          },
        },
      },
      responses: { 200: { description: "Payment confirmed successfully" } },
    },
  },

  "/api/payments": {
    get: {
      tags: ["Payments"],
      summary: "Get tenant payment history",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Payment history retrieved successfully" },
      },
    },
  },

  "/api/payments/{id}": {
    get: {
      tags: ["Payments"],
      summary: "Get payment details",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Payment details retrieved successfully" },
      },
    },
  },

  "/api/payments/webhook": {
    post: {
      tags: ["Payments"],
      summary: "Stripe webhook endpoint",
      responses: {
        200: { description: "Stripe webhook received successfully" },
      },
    },
  },

  "/api/reviews": {
    post: {
      tags: ["Reviews"],
      summary: "Create property review - Tenant only",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              propertyId: "PROPERTY_ID",
              rating: 5,
              comment: "The property was clean and comfortable.",
            },
          },
        },
      },
      responses: { 201: { description: "Review created successfully" } },
    },
  },

  "/api/reviews/property/{propertyId}": {
    get: {
      tags: ["Reviews"],
      summary: "Get reviews by property",
      parameters: [
        {
          name: "propertyId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Property reviews retrieved successfully" },
      },
    },
  },

  "/api/admin/dashboard": {
    get: {
      tags: ["Admin"],
      summary: "Get admin dashboard statistics",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Admin dashboard statistics retrieved successfully",
        },
      },
    },
  },

  "/api/admin/users": {
    get: {
      tags: ["Admin"],
      summary: "Get all users",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "string" } },
        { name: "limit", in: "query", schema: { type: "string" } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "role", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: { type: "string" } },
      ],
      responses: { 200: { description: "Users retrieved successfully" } },
    },
  },

  "/api/admin/users/{id}/status": {
    patch: {
      tags: ["Admin"],
      summary: "Ban or unban user",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: { status: "BANNED" },
          },
        },
      },
      responses: { 200: { description: "User status updated successfully" } },
    },
  },

  "/api/admin/properties": {
    get: {
      tags: ["Admin"],
      summary: "Get all properties for admin",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Admin properties retrieved successfully" },
      },
    },
  },

  "/api/admin/properties/{id}": {
    get: {
      tags: ["Admin"],
      summary: "Get property details for admin",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Admin property details retrieved successfully" },
      },
    },
  },

  "/api/admin/rentals": {
    get: {
      tags: ["Admin"],
      summary: "Get all rentals for admin",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Admin rentals retrieved successfully" },
      },
    },
  },

  "/api/admin/rentals/{id}": {
    get: {
      tags: ["Admin"],
      summary: "Get rental details for admin",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Admin rental details retrieved successfully" },
      },
    },
  },
};
