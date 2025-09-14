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

const updatePassword = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
};

const sendResetToken = {
  body: Joi.object({
    email: Joi.string().required().email(),
  }),
};

const resetPassword = {
  body: Joi.object({
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
  query: Joi.object({
    token: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  updatePassword,
  resetPassword,
  sendResetToken,
};
