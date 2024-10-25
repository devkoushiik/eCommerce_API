const Order = require("../model/Order");
const Product = require("../model/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermission = require("../utils/checkPermission");

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = "someRandomValue";
  return { clientSecret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id : ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;

    // construct singleOrderObject
    const singleOrderObject = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add order to orderItems
    orderItems = [...orderItems, singleOrderObject];
    // calculate subtotal
    subtotal += item.amount * price;
  }

  const total = tax + shippingFee + subtotal;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: paymentIntent.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const product = await Order.findOne({ _id: orderId });
  if (!product) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermission(req.user, product.user);
  res.status(StatusCodes.OK).json({ product });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  if (orders.length < 1) {
    return res
      .status(StatusCodes.OK)
      .json({ count: 0, orders, msg: "No order found..." });
  }
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermission(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
