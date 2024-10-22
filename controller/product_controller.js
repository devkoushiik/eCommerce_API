const Product = require("../model/Product");
const { StatusCodes } = require("http-status-codes");
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProducts = async (req, res) => {
  res.send("get all Product.");
};
const getSingleProduct = async (req, res) => {
  res.send("Get Single Product.");
};

const updateProduct = async (req, res) => {
  res.send("Update Product.");
};

const deleteProduct = async (req, res) => {
  res.send("Delete Product.");
};

const uploadImage = async (req, res) => {
  res.send("Upload Image.");
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
