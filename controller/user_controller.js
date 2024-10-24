const User = require('../model/User')
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const createTokenUser = require("../utils/createTokenUser");
const { attachCookiesToResponse } = require("../utils/jwt");
const checkPermission = require('../utils/checkPermission');
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  if (users.length === 0) {
    throw new CustomError.NotFoundError("No user found");
  }
  res.status(StatusCodes.OK).json(users);
};
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ role: "user", _id: req.params.id }).select(
    "-password"
  );
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json(user);
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};
// using save method to update user
// you have to update user manually
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide name and email");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  await user.save();

  // most important
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};
// update user password
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide old and new password"
    );
  }
  const user = await User.findOne({ role: "user", _id: req.user.userId });

  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword.toString());

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Old password not correct");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json(req.user);
};
module.exports = {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword}


// const updateUser = async (req, res) => {
//     const { name, email } = req.body;
//     if (!name || !email) {
//       throw new CustomError.BadRequestError("Please provide name and email");
//     }
//     const user = await User.findOneAndUpdate(
//       { role: "user", _id: req.user.userId },
//       { name, email },
//       { new: true, runValidators: true }
//     );
//     if (!user) {
//       throw new CustomError.NotFoundError("User not found");
//     }
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({ res, user: tokenUser });
  
//     res.status(StatusCodes.OK).json({ user: tokenUser });
//   };