const UserProduct = require("../models/UserProduct");
const catchAsync = require("../utils/catchAsync");

const getMyProducts = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const products = await UserProduct.find({ user: userId })
    .populate("product")
    .sort({ createdAt: -1, _id: 1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await UserProduct.countDocuments({ user: userId });

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

module.exports = { getMyProducts };
