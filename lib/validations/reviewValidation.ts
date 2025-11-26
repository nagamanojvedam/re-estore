const Joi = require('joi');

const addOrUpdate = {
  body: {
    productId: Joi.string().required(),

    rating: Joi.number().required().min(1).max(5),
    title: Joi.string().max(100).allow(''),
    comment: Joi.string().max(500).allow(''),
  },
};

module.exports = {
  addOrUpdate,
};
