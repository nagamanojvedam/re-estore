const express = require("express");
const {
  getAllMessages,
  createMessage,
} = require("../controllers/messageController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
  createMessage: createMessageValidation,
} = require("../validations/messageValidation");

const router = express.Router();

router
  .route("/")
  .get(auth, authorize("admin"), getAllMessages)
  .post(validate(createMessageValidation), createMessage);

module.exports = router;
