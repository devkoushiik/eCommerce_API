const Unauthorized = require("../errors/unauthorized");
const checkPermission = (userId, tokenUser) => {
  //   console.log(userId, tokenUser);
  //   console.log(userId.toString());
  if (tokenUser.role === "admin") return;
  if (tokenUser.userId === userId.toString()) return;
  throw new Unauthorized("Not authorized to access this route");
};
module.exports = checkPermission;
