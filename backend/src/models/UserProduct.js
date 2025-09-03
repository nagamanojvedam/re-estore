const mongoose = require("mongoose");

const userProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  isReviewed: { type: Boolean, default: false },
  lastPurchasedAt: { type: Date, default: Date.now },
  purchaseCount: { type: Number, default: 1 },
});

// Ensure one product per user
userProductSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("UserProduct", userProductSchema);
