const app = require("./src/app");
const config = require("./src/config/config");
const { connectDB } = require("./src/config/database");

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB(); // Replace with your actual DB connection function

    const server = app.listen(config.port, () => {
      console.log(
        `⚡ Server running on port ${config.port} in ${config.env} mode.`
      );
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Promise Rejection:", err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      process.exit(1);
    });

    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
