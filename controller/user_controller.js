const User = require('../model/User')
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const getAllUsers = async (req, res) => {
        console.log(req.user)
        const users = await User.find({role: 'user'}).select('-password');
    if(users.length === 0) {
        throw new CustomError.NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json(users); 
};
const getSingleUser = async (req, res) => {
    const user = await User.findOne({role: 'user', _id: req.params.id}).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError('User not found');
    }
    res.status(StatusCodes.OK).json(user);
};
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json(req.user);
};
const updateUser = async (req, res) => {
    res.send('update single user');
};
const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword}  = req.body;
    if(!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide old and new password');
    }
    console.log(req.user)
    const user = await User.findOne({ role: 'user', _id: req.user.userId });

    if (!user) {
        throw new CustomError.NotFoundError('User not found');
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword.toString());

    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Old password not correct');
    }

    user.password = newPassword
    await user.save();

    res.status(StatusCodes.OK).json(req.user);
};
module.exports = {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword}