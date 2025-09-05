const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const UserProduct = require("../models/UserProduct");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const addOrUpdateReview = catchAsync(async (req, res) => {
  const { productId, rating, title, comment } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid productId");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const review = await Review.findOneAndUpdate(
      {
        product: productId,
        user: userId,
      },
      {
        $set: { rating, title, comment, updatedAt: new Date(), isActive: true },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        session,
      }
    );

    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.mongo.ObjectId(productId),
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$product",
          average: { $avg: "$rating" },
          count: { $sum: 1 },
          sum: { $sum: "$rating" },
        },
      },
    ]).session(session);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(
        productId,
        {
          $set: {
            "ratings.average": stats[0].average,
            "ratings.count": stats[0].count,
            "ratings.sum": stats[0].sum,
          },
        },
        {
          session,
        }
      );
    } else {
      // no reviews left (if user deletes review later)
      await Product.findByIdAndUpdate(
        productId,
        {
          $set: {
            "ratings.average": 0,
            "ratings.count": 0,
            "ratings.sum": 0,
          },
        },
        {
          session,
        }
      );
    }

    await UserProduct.findOneAndUpdate(
      { user: userId, product: productId },
      { $set: { isReviewed: true } },
      {
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      data: { review },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const getReview = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid productId");
  }

  const review = await Review.findOne({
    product: productId,
    user: userId,
    isActive: true,
  });

  res.status(200).json({
    status: "success",
    data: { review: review || null },
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { _id: userId } = req.user;
  if (!productId || !userId) {
    throw new ApiError(400, "Invalid credentials / Missing fields.");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid productId");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const review = await Review.findOneAndUpdate(
      {
        product: productId,
        user: userId,
        isActive: true,
      },
      {
        $set: { isActive: false },
      },
      {
        new: true,
        session,
      }
    );

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { "ratings.count": -1, "ratings.sum": -review.rating },
      },
      { new: true, session }
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    product.ratings.average =
      product.ratings.count > 0
        ? product.ratings.sum / product.ratings.count
        : 0;
    await product.save({ session });

    await UserProduct.findOneAndUpdate(
      { user: userId, product: productId },
      { $set: { isReviewed: false } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

module.exports = {
  addOrUpdateReview,
  getReview,
  deleteReview,
};
