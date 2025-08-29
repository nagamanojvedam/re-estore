const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const config = require("./config/config");
const { errorConverter, errorHandler } = require("./middleware/error");
const rateLimiter = require("./middleware/rateLimiter");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Security middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

if (config.env === "development") {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}

// Logging
if (config.env !== "production") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api", rateLimiter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running!",
    timeStamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Serve static files in production
if (config.env === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend", "dist")));

  app.get(/.*/, (req, res) =>
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"))
  );
}

// 404 Hanlder
app.all(/.*/, (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
