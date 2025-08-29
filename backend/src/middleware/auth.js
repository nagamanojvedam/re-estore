const jwt = require("jsonwebtoken");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

const auth = catchAsync(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    if (decoded.type !== "access") {
      throw new ApiError(401, "Invalid token type");
    }

    const user = await User.findById(decoded.sub).select("+passwordChangedAt");

    if (!user || !user.isActive) {
      throw new ApiError(401, "User not found or inactive");
    }

    if (user.passwordChangedAt) {
      const timestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);

      if (decoded.iat < timestamp) {
        throw new ApiError(401, "Password changed. Please log in again.");
      }
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid token");
    }
    throw error;
  }
});

module.exports = auth;
