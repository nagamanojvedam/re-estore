const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createProduct: createProductValidation,
  getProducts: getProductsValidation,
  getProduct: getProductValidation,
  updateProduct: updateProductValidation,
  deleteProduct: deleteProductValidation,
} = require("../validations/productValidation");

const router = express.Router();

router.get("/", validate(getProductsValidation), getProducts);
router.post("/", auth, validate(createProductValidation), createProduct);

router.get("/:id", validate(getProductValidation), getProduct);
router.patch("/:id", auth, validate(updateProductValidation), updateProduct);
router.delete("/:id", auth, validate(deleteProductValidation), deleteProduct);

module.exports = router;
