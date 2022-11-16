const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.sendStripeKey = async (req, res, next) => {
  try {
    res.status(200).json({
      stripeKey: process.env.STRIPE_API_KEY,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.sendRazorpayKey = async (req, res, next) => {
  try {
    res.status(200).json({
      razorpayKey: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.captureStripePayment = async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: req.body.amount,
          },
        },
      ],
      mode: 'payment',
    });

    res.status(200).json({
      success: true,
      client_secret: session,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.captureRazorpayPayment = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const myOrder = instance.orders.create({
      amount: req.body.amount,
      currency: 'INR',
    });

    res.status(200).json({
      success: true,
      amount: req.body.amount,
      order: myOrder,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};
