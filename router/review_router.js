const express = require("express");
const router = express.Router();
const { authenticationUser } = require("../middleware/authentication");
const {
  createReview,
  updateReview,
  getSingleReview,
  deleteReview,
  getAllReview,
} = require("../controller/review_controller");

router.route("/").post(authenticationUser, createReview).get(getAllReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticationUser, updateReview)
  .delete(authenticationUser, deleteReview);

module.exports = router;
