const Joi = require("joi");

const updateMeValidation = {
  body: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string()
      .pattern(/^[0-9+\-() ]{7,20}$/)
      .allow(""),
    location: Joi.string().max(100).allow(""),
    website: Joi.string().uri().allow(""),
    bio: Joi.string().max(500).allow(""),
  }),
};

module.exports = {
  updateMeValidation,
};
