const Joi = require("joi");

const createOrder = {
  body: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }),
  }),
};

const getOrders = {
  query: Joi.object({
    status: Joi.string()
      .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
      .allow(""), // empty string means "no filter"
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

module.exports = {
  createOrder,
  getOrders,
};
