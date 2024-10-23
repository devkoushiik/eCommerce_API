const { StatusCodes } = require("http-status-codes");
const User = require("../model/User");
const CustomError = require("../errors");
const { attachCookiesToResponse } = require("../utils/jwt");
const createTokenUser = require("../utils/createTokenUser");

const registerController = async (req, res) => {
  const { email, password, name } = req.body;
  // check email exist or not
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  // first user is admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  // insert new document
  const user = await User.create({ email, password, name, role });
  const tokenUser = createTokenUser(user);
  // create cookie and attach function
  attachCookiesToResponse({ res, user: tokenUser });
  // check
  console.log("req.signedCokies : ", req.signedCookies);
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid email or password");
  }
  const isPasswordCorrect = await user.comparePassword(password.toString());
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid email or password");
  }
  const tokenUser = createTokenUser(user);
  // console.log(tokenUser);
  attachCookiesToResponse({ res, user: tokenUser });
  console.log("login/req.user : ", req.user);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logoutController = async (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({msg: 'user logged out'});
}

module.exports = {loginController,registerController,logoutController};
