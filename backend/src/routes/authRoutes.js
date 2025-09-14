const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  updatePassword,
  sendResetToken,
  resetPassword,
} = require("../controllers/authController");
const validate = require("../middleware/validate");
const {
  register: registerValidation,
  login: loginValidation,
  refresh: refreshValidation,
  logout: logoutValidation,
  updatePassword: updatePasswordValidation,
  sendResetToken: sendResetTokenValidation,
  resetPassword: resetPasswordValidation,
} = require("../validations/authValidation");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/refresh", validate(refreshValidation), refresh);
router.post("/logout", validate(logoutValidation), logout);
router.post(
  "/update-password",
  validate(updatePasswordValidation),
  auth,
  updatePassword
);
router.post(
  "/forgot-password",
  validate(sendResetTokenValidation),
  sendResetToken
);

router.post(
  "/reset-password",
  validate(resetPasswordValidation),
  resetPassword
);

module.exports = router;
