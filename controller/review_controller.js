const Product = require("../model/Product");
const Review = require("../model/Review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermission = require("../utils/checkPermission");

const createReview = async (req, res) => {
  // productId is valid?
  // user already submitted review?
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No product found with id : ${productId}`
    );
  }
  const alreadySubmittedReview = await Review.findOne({
    product: productId,
    userId: req.user.userId,
  });
  if (alreadySubmittedReview) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }
  // either create new object or modify req.body
  // we chose modify req.body
  req.body.userId = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReview = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
  const singleReview = await Review.findOne({ _id: req.params.id });
  if (!singleReview) {
    throw new CustomError.NotFoundError(
      `No review found with id : ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ singleReview });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { title, comment, rating } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with id : ${reviewId}`
    );
  }
  // check permission
  checkPermission(req.user, review.userId);
  review.title = title;
  review.comment = comment;
  review.rating = rating;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with id : ${reviewId}`
    );
  }
  // check permission
  checkPermission(req.user, review.userId);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "delete success" });
};

module.exports = {
  createReview,
  getAllReview,
  updateReview,
  getSingleReview,
  deleteReview,
};
