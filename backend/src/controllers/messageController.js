const Message = require("../models/Message");
const catchAsync = require("../utils/catchAsync");

const getAllMessages = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.params;

  const skip = (page - 1) * limit;

  const messages = await Message.find({})
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1, _id: -1 });

  const total = await Message.countDocuments({});

  res.json({
    status: "success",
    data: {
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const createMessage = catchAsync(async (req, res) => {
  const { name, email, message } = req.body;

  const newMessage = await Message.create({ name, email, message });

  res.status(201).json({
    status: "success",
    message: "Message created successfully",
    data: {
      newMessage,
    },
  });
});

module.exports = {
  getAllMessages,
  createMessage,
};
