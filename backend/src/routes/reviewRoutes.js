const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { addOrUpdate } = require("../validations/reviewValidation");
const {
  addOrUpdateReview,
  getReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/:productId", auth, authorize("user"), getReview);

router.post(
  "/",
  validate(addOrUpdate),
  auth,
  authorize("user"),
  addOrUpdateReview
);

module.exports = router;
