const Order = require("../models/Order");
const Product = require("../models/Product");
const UserProduct = require("../models/UserProduct");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const stripeService = require("../services/stripeService");

const verifyOrder = catchAsync(async (req, res, next) => {
  const { items } = req.body;

  const products = {};

  for (const item of items) {
    const product = await Product.findOne({
      _id: item.product,
      isActive: true,
    });

    if (!product) {
      throw new ApiError(404, `Product ${item.product} not found`);
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for product ${product.name}`);
    }
    products[item.product] = product;
  }

  req.products = products;
  next();
});

const createOrder = catchAsync(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  // Calculate total
  let subTotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findOne({
      _id: item.product,
      isActive: true,
    });

    const itemTotal = product.price * item.quantity;
    subTotal += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const shipping = subTotal < 5000 ? 1000 : 0;
  const tax = subTotal * 0.08;
  const totalAmount = subTotal + shipping + tax;

  // Create order
  const isCash = paymentMethod === "cash";

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    subTotal,
    shipping,
    tax,
    totalAmount,
    shippingAddress,
    paymentStatus: "pending",
    paymentMethod,
    status: isCash ? "confirmed" : "pending",
  });

  await order.populate([
    { path: "user", select: "name email" },
    { path: "items.product", select: "name price category images" },
  ]);

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: {
      order,
    },
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const filter = { user: req.user._id };
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate("items.product", "name price category images")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  res.json({
    status: "success",
    data: {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .populate("items.product", "name price category")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  res.json({
    status: "success",
    data: {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const allowedTransactions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const currentStatus = order.status;
  const nextValidStatus = allowedTransactions[currentStatus] || [];

  if (!nextValidStatus.includes(status)) {
    throw new ApiError(
      400,
      `Invalid order status transition: ${currentStatus} -> ${status}`
    );
  }

  order.status = status;
  await order.save();

  if (status === "delivered") {
    for (const item of order.items) {
      await UserProduct.findOneAndUpdate(
        {
          user: order.user,
          product: item.product,
        },
        {
          $set: { lastPurchasedAt: new Date() },
          $inc: { purchaseCount: 1 },
        },
        { upsert: true, new: true }
      );
    }
  }

  await order.populate([
    { path: "user", select: "name email" },
    { path: "items.product", select: "name price category" },
  ]);

  res.json({
    status: "success",
    message: "Order status updated successfully",
    data: {
      order,
    },
  });
});

const getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("items.product");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.json({
    status: "success",
    data: {
      order,
    },
  });
});

const getOrderByNumber = catchAsync(async (req, res) => {
  const { orderNumber } = req.params;

  const order = await Order.findOne({ orderNumber }).populate("items.product");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.json({
    status: "success",
    data: {
      order,
    },
  });
});

const cancelMyOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to cancel this order");
  }

  if (!allowedTransactions[order.status].includes("cancelled")) {
    throw new ApiError(400, "You cannot cancel this order");
  }

  if (order.status === "cancelled") {
    throw new ApiError(400, "This order has already been cancelled");
  }

  order.status = "cancelled";
  order.paymentStatus = order.paymentStatus === "paid" ? "refunded" : "failed";
  await order.save();

  res.json({
    status: "success",
    message: "Order cancelled successfully",
    data: {
      order,
    },
  });
});

const createStripeSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, "Not authorized to pay for this order");
  }

  // Get products for Stripe line items
  const productIds = order.items.map((item) => item.product.toString());
  const productdocs = await Product.find({ _id: { $in: productIds } });
  const productsMap = {};
  productdocs.forEach((p) => {
    productsMap[p._id.toString()] = p;
  });

  const session = await stripeService.createCheckoutSession(order, productsMap);

  res.json({
    status: "success",
    data: {
      url: session.url,
    },
  });
});

module.exports = {
  verifyOrder,
  createOrder,
  getOrder,
  getOrderByNumber,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
  createStripeSession,
};
