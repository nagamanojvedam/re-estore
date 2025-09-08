const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
      trim: true,
    },
    email: {
      type: "String",
      required: true,
      trim: true,
    },
    message: {
      type: "String",
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("Message", messageSchema);
