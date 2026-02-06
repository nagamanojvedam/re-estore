const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrder,
  getOrderByNumber,
  cancelMyOrder,
  verifyOrder,
  createStripeSession,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
  createOrder: createOrderValidation,
  getOrders: getOrdersValidation,
} = require("../validations/orderValidation");

const router = express.Router();

router.get(
  "/",
  auth,
  authorize("admin"),
  validate(getOrdersValidation),
  getAllOrders
);
router.post(
  "/",
  auth,
  validate(createOrderValidation),
  verifyOrder,
  createOrder
);
router.get("/me", auth, validate(getOrdersValidation), getMyOrders);

router.get("/:id", auth, getOrder);
router.patch("/:id/status", auth, authorize("admin"), updateOrderStatus);

router.get("/orderNumber/:orderNumber", getOrderByNumber);
router.post("/cancelMyOrder/:id", auth, cancelMyOrder);
router.post("/:id/checkout-session", auth, createStripeSession);

module.exports = router;
