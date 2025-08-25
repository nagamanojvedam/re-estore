const Order = require("../models/Order");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const createOrder = catchAsync(async (req, res) => {
  const { items, shippingAddress } = req.body;

  // Validate products and calculate total
  let totalAmount = 0;
  const orderItems = [];

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

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
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

const updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();

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

module.exports = {
  createOrder,
  getOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
