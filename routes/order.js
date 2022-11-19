const express = require('express');
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
  adminAllOrders,
  adminGetOrder,
  adminDeleteOrder,
  adminUpdateOrder,
} = require('../controllers/order');
const { isLoggedIn, customRole } = require('../middlewares/user');
const router = express.Router();

router.route('/order/create').post(isLoggedIn, createOrder);

router.route('/order/myorders').get(isLoggedIn, getLoggedInOrders);

router.route('/order/:id').get(isLoggedIn, getOneOrder);

// admin routes
router
  .route('/admin/orders')
  .get(isLoggedIn, customRole('admin'), adminAllOrders);

router
  .route('/admin/order/:id')
  .get(isLoggedIn, customRole('admin'), adminGetOrder)
  .put(isLoggedIn, customRole('admin'), adminUpdateOrder)
  .delete(isLoggedIn, customRole('admin'), adminDeleteOrder);

module.exports = router;
