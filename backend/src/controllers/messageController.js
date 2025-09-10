const Message = require("../models/Message");
const catchAsync = require("../utils/catchAsync");

const getAllMessages = catchAsync(async (req, res) => {
  console.log(req.query);
  const { page = 1, limit = 10 } = req.query;

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

const replyMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  const updated = await Message.findByIdAndUpdate(
    { _id: id, isReplied: false },
    {
      $set: { reply, isReplied: true },
    },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, "Message already replied");
  }
  res.json({
    status: "success",
    message: "Message replied successfully",
  });
});

module.exports = {
  getAllMessages,
  createMessage,
  replyMessage,
};
