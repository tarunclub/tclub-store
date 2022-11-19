const Product = require('../models/product');
const Order = require('../models/order');

exports.createOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.getOneOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return next(new Error('No order is present by the id'));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.getLoggedInOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
      return next(new Error('Order is empty'));
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.adminAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    if (!orders) {
      return next(new Error('Order is empty'));
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.adminGetOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new Error('Order is empty'));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.adminDeleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return next(new Error('Order is empty'));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.adminUpdateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === 'Delivered') {
      return next(new Error('Order is already delivered'));
    }

    order.orderStatus = req.body.orderStatus;

    order.orderItems.forEach(async (prod) => {
      await updateProductStock(prod.product, prod.quantity);
    });

    await order.save();
  } catch (error) {
    return next(new Error(error.message));
  }
};

async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}
