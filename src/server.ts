import app from "./app.js";
import config from "./config/index.js";

const server = app.listen(config.port, () => {
  console.log(`RentNest server is running on port ${config.port}`);
});

process.on("unhandledRejection", () => {
  console.log("Unhandled rejection detected. Server shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", () => {
  console.log("Uncaught exception detected. Server shutting down...");
  process.exit(1);
});