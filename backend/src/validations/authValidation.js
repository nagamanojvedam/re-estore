const Joi = require("joi");

const register = {
  body: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(128),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const refresh = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
