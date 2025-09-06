const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { addOrUpdate } = require("../validations/reviewValidation");
const {
  addOrUpdateReview,
  getReview,
  deleteReview,
  getAllReviews,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/all/:productId", getAllReviews);
router.get("/:productId", auth, authorize("user"), getReview);
router.delete("/:productId", auth, authorize("user"), deleteReview);

router.post(
  "/",
  validate(addOrUpdate),
  auth,
  authorize("user"),
  addOrUpdateReview
);

module.exports = router;
