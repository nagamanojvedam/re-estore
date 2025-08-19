const express = require("express");
// const helmet = require("helmet");
const cors = require("cors");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
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
// app.use(helmet());
if (config.env === "development") {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}
// app.use(mongoSanitize());
// app.use(xss());

// Logging
if (config.env !== "production") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api", rateLimiter);

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Backend API",
      version: "1.0.0",
      description: "Production-ready E-commerce API",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Development server",
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
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

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
