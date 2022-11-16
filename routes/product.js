const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

const { addProduct, getAllProducts } = require("../controllers/product");

router.route("/products").get(isLoggedIn, getAllProducts);

// admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

module.exports = router;
