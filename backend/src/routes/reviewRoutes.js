const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { addOrUpdateReview } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", auth, authorize("user"), addOrUpdateReview);

module.exports = router;
