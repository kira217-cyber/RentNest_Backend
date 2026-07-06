import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "RentNest API",
    version: "1.0.0",
    description:
      "RentNest backend API for rental property marketplace with Tenant, Landlord and Admin roles.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
    {
      url: "https://your-live-api-url.vercel.app",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/modules/**/*.route.ts", "./src/docs/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;