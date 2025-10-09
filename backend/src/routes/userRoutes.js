const express = require("express");
const {
  getMe,
  updateMe,
  getUsers,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  verifyEmail,
  toggleUserActive,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
  updateMeValidation,
  toggleUserActiveValidation,
} = require("../validations/userValidation");
const { getMyProducts } = require("../controllers/userProductController");

const router = express.Router();

router.get("/me/products", auth, getMyProducts);

router.get("/me", auth, getMe);
router.patch("/me", auth, validate(updateMeValidation), updateMe);

router.get("/wishlist", auth, getWishlist);
router.delete("/wishlist", auth, clearWishlist);

router.post("/wishlist/:productId", auth, addToWishlist);
router.delete("/wishlist/:productId", auth, removeFromWishlist);

router.post("/verifyEmail/:token", verifyEmail);

router.get("/", auth, authorize("admin"), getUsers);

router.patch(
  "/:id/toggle-user-active",
  auth,
  authorize("admin"),
  validate(toggleUserActiveValidation),
  toggleUserActive
);

module.exports = router;
