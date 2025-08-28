const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const createProduct = catchAsync(async (req, res) => {
  const productData = {
    ...req.body,
    owner: req.user._id,
  };

  const product = await Product.create(productData);
  await product.populate("owner", "name email");

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: {
      product,
    },
  });
});

const getProducts = catchAsync(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive,
  } = req.query;

  // Build filter object
  const filter = isActive ? { isActive } : {};

  if (req.query.exclude) {
    filter._id = { $ne: req.query.exclude };
  }

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  if (minRating) {
    filter["ratings.average"] = { $gte: Number(minRating) };
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .populate("owner", "name email")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  res.json({
    status: "success",
    data: {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    isActive: true,
  }).populate("owner", "name email");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({
    status: "success",
    data: {
      product,
    },
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check ownership or admin role
  if (
    product.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only update your own products");
  }

  if (req.body.stock != null && req.body.stock < 0) {
    throw new ApiError(400, "Stock cannot be negative");
  }

  Object.assign(product, req.body);
  await product.save();
  await product.populate("owner", "name email");

  res.json({
    status: "success",
    message: "Product updated successfully",
    data: {
      product,
    },
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check ownership or admin role
  if (
    product.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only delete your own products");
  }

  // Soft delete
  product.isActive = !product.isActive;
  await product.save();

  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
