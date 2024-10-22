const router = require("express").Router();
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/product_controller");
const {
  authenticationUser,
  authenticationAdmin,
} = require("../middleware/authentication");

router
  .route("/")
  .post([authenticationUser, authenticationAdmin("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticationUser, authenticationAdmin("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticationUser, authenticationAdmin("admin")], updateProduct)
  .delete([authenticationUser, authenticationAdmin("admin")], deleteProduct);

module.exports = router;
