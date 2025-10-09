const { jwt } = require("../config/config");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
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

  const users = await User.find()
    .select("-password -__v")
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

const updateMe = catchAsync(async (req, res) => {
  const { id } = req.user;
  const updates = req.body;

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("-password -__v");

  res.json({
    status: "success",
    data: { user },
  });
});

const getWishlist = catchAsync(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id)
    .select("-password -__v")
    .populate("wishlist.productId");

  res.json({ status: "success", data: { wishlist: user.wishlist } });
});

const addToWishlist = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user.wishlist.find((item) => item.productId.toString() === productId))
    user.wishlist.push({ productId });

  await user.save();
  await user.populate("wishlist.productId");

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
    (item) => item.productId.toString() !== productId
  );

  await user.save();
  await user.populate("wishlist.productId");

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

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.params;

  const decoded = await jwt.verify(token, config.jwt.secret);

  if (!decoded) throw new ApiError(400, "Unable to activate user");

  await User.findOneAndUpdate(
    { _id: decoded.id },
    { $set: { isEmailVerified: true } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "User email verified successfully",
  });
});

const toggleUserActive = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isUserActive } = req.body;

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { $set: { isActive: !isUserActive } },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: `User ${user.isActive ? "Activated" : "Deactivated"}`,
    data: { user },
  });
});

module.exports = {
  getMe,
  updateMe,
  getUsers,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  verifyEmail,
  toggleUserActive,
};
