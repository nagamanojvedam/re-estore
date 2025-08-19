const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

const getMe = catchAsync(async (req, res) => {
  res.json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

const getUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const users = await User.find({ isActive: true })
    .select("-password")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments({ isActive: true });

  res.json({
    status: "success",
    data: {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getWishlist = catchAsync(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id).populate("wishlist.productId");

  res.json({ status: "success", data: { wishlist: user.wishlist } });
});

const addToWishlist = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user.wishlist.find((item) => item.productId.toString() === productId))
    user.wishlist.push({ productId });

  await user.save();

  res.json({
    status: "success",
    data: {
      wishlist: user.wishlist,
    },
  });
});

const removeFromWishlist = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user;

  const user = await User.findById(id);

  user.wishlist = user.wishlist.filter(
    (item) => item.productId.toString() === productId
  );

  await user.save();

  res.json({
    status: "success",
    data: {
      wishlist: user.wishlist,
    },
  });
});

const clearWishlist = catchAsync(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);

  user.wishlist = [];
  await user.save();

  res.json({
    status: "success",
    data: {
      wishlist: user.wishlist,
    },
  });
});

module.exports = {
  getMe,
  getUsers,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
