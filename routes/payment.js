const express = require('express');
const {
  sendStripeKey,
  sendRazorpayKey,
  captureStripePayment,
  captureRazorpayPayment,
} = require('../controllers/payment');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

router.route('/stripekey').get(isLoggedIn, sendStripeKey);
router.route('/razorpaykey').get(isLoggedIn, sendRazorpayKey);
router.route('/stripepayment').post(isLoggedIn, captureStripePayment);
router.route('/razorpaypayment').post(isLoggedIn, captureRazorpayPayment);

module.exports = router;
