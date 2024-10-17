const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,
    "please provide name"],
    minlength: 3
  },
  email: {
    type: String,
    required: [true,
    "please provide email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "please provide valid email"
    }
  },
  password: {
    type: String,
    required: [true,
    "please provide password"],
    minlength: 4
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  }
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model('User', userSchema);