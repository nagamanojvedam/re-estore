const Joi = require('joi');

const createMessage = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required(),
  }),
};

const replyMessage = {
  body: Joi.object({
    reply: Joi.string().required(),
  }),
};

module.exports = {
  createMessage,
  replyMessage,
};
