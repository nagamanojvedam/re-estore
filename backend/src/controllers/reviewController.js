const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const UserProduct = require("../models/UserProduct");
const catchAsync = require("../utils/catchAsync");

const addOrUpdateReview = catchAsync(async (req, res) => {
  const { productId, rating, title, comment } = req.body;
  const userId = req.user._id;

  const review = await Review.findOneAndUpdate(
    {
      product: productId,
      user: userId,
    },
    {
      rating,
      title,
      comment,
      updatedAt: Date.now(),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  const stats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$product",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      $set: {
        "ratings.average": stats[0].average,
        "ratings.count": stats[0].count,
      },
    });
  } else {
    // no reviews left (if user deletes review later)
    await Product.findByIdAndUpdate(productId, {
      $set: {
        "ratings.avgRating": 0,
        "ratings.count": 0,
      },
    });
  }

  await UserProduct.findOneAndUpdate(
    { user: userId, product: productId },
    { $set: { isReviewed: true } }
  );

  res.status(200).json({
    status: "success",
    data: { review },
  });
});

module.exports = {
  addOrUpdateReview,
};
