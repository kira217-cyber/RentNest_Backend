import swaggerJSDoc from "swagger-jsdoc";
import { swaggerPaths } from "./swagger.paths.js";

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
      url: "https://rentnest-backend.vercel.app",
      description: "Production server",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Categories" },
    { name: "Properties" },
    { name: "Rentals" },
    { name: "Payments" },
    { name: "Reviews" },
    { name: "Admin" },
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
  paths: swaggerPaths,
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
