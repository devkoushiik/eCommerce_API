const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controller/order_controller");
const {
  authenticationUser,
  authenticationAdmin,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticationUser, createOrder)
  .get(authenticationUser, authenticationAdmin("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticationUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticationUser, getSingleOrder)
  .patch(authenticationUser, updateOrder);

module.exports = router;
