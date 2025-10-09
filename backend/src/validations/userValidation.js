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

const toggleUserActiveValidation = {
  params: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
  body: Joi.object({
    isUserActive: Joi.boolean(),
  }),
};

module.exports = {
  updateMeValidation,
  toggleUserActiveValidation,
};
