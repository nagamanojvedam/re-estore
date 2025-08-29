const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { generateAuthTokens, verifyToken } = require("../utils/jwt");

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate tokens
  const tokens = await generateAuthTokens(user);

  // Save refresh token
  await RefreshToken.create({
    token: tokens.refresh.token,
    user: user._id,
    expires: tokens.refresh.expires,
  });

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: {
      user,
      tokens,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Get user with password
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(401, "Account is deactivated");
  }

  // Generate tokens
  const tokens = await generateAuthTokens(user);

  // Save refresh token
  await RefreshToken.create({
    token: tokens.refresh.token,
    user: user._id,
    expires: tokens.refresh.expires,
  });

  // Remove password from response
  user.password = undefined;

  res.json({
    status: "success",
    message: "Login successful",
    data: {
      user,
      tokens,
    },
  });
});

const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== "refresh") {
      throw new ApiError(401, "Invalid token type");
    }

    // Check if refresh token exists and is not revoked
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      revoked: false,
    });

    if (!tokenDoc) {
      throw new ApiError(401, "Refresh token not found or revoked");
    }

    // Get user
    const user = await User.findById(decoded.sub);

    if (!user || !user.isActive) {
      throw new ApiError(401, "User not found or inactive");
    }

    // Generate new tokens
    const tokens = await generateAuthTokens(user);

    // Revoke old refresh token
    tokenDoc.revoked = true;
    await tokenDoc.save();

    // Save new refresh token
    await RefreshToken.create({
      token: tokens.refresh.token,
      user: user._id,
      expires: tokens.refresh.expires,
    });

    res.json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        tokens,
      },
    });
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  // Revoke refresh token
  await RefreshToken.updateOne({ token: refreshToken }, { revoked: true });

  res.json({
    status: "success",
    message: "Logout successful",
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.user;

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  const user = await User.findById(id).select("+password");

  if (!user || !(await user.isPasswordMatch(currentPassword))) {
    throw new ApiError(401, "Invalid current password");
  }

  user.password = newPassword;
  await user.save();

  // Generate tokens
  const tokens = await generateAuthTokens(user);

  // Save refresh token
  await RefreshToken.create({
    token: tokens.refresh.token,
    user: user._id,
    expires: tokens.refresh.expires,
  });

  res.json({
    status: "success",
    message: "password updated successfully",
    data: { tokens },
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  updatePassword,
};
