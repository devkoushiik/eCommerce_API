const Product = require("../model/Product");
const Review = require("../model/Review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createReview = async (req, res) => {
  // productId is valid?
  // user already submitted review?
  console.log("review controller", req.user);
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No product found with id : ${productId}`
    );
  }
  const alreadySubmittedReview = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmittedReview) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReview = async (req, res) => {
  res.send("get all reviews...");
};

const getSingleReview = async (req, res) => {
  res.send("single review...");
};
const updateReview = async (req, res) => {
  res.send("update review...");
};

const deleteReview = async (req, res) => {
  res.send("delete review...");
};

module.exports = {
  createReview,
  getAllReview,
  updateReview,
  getSingleReview,
  deleteReview,
};
