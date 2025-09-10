const express = require("express");
const {
  getAllMessages,
  createMessage,
  replyMessage,
} = require("../controllers/messageController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
  createMessage: createMessageValidation,
  replyMessage: replyMessageValidation,
} = require("../validations/messageValidation");

const router = express.Router();

router
  .route("/")
  .get(auth, authorize("admin"), getAllMessages)
  .post(validate(createMessageValidation), createMessage);

router
  .route("/:id")
  .post(
    auth,
    authorize("admin"),
    validate(replyMessageValidation),
    replyMessage
  );

module.exports = router;
