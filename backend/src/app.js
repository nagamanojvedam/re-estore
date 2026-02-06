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
const reviewRoutes = require("./routes/reviewRoutes");
const messageRoutes = require("./routes/messageRoutes");
const stripeService = require("./services/stripeService");
const Order = require("./models/Order");

const app = express();

app.set("trust proxy", 1); // Trust first proxy if behind a reverse proxy (e.g., Heroku, Nginx)

// Security middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      imgSrc: ["'self'", "https://images.unsplash.com", "data:"],
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

// Stripe Webhook (MUST be before express.json body parser)
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripeService.constructEvent(req.body, sig);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      try {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "paid";
          order.status = "confirmed";
          await order.save();
          console.log(`Order ${orderId} marked as paid.`);
        }
      } catch (err) {
        console.error(`Error updating order ${orderId}: ${err.message}`);
      }
    }

    res.json({ received: true });
  }
);

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
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);

// Routes replaced by orderRoutes or removed as redundant

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
