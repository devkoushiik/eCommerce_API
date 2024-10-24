const Unauthorized = require("../errors/unauthorized");
const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new Unauthorized("Not authorized to access this route");
};
module.exports = checkPermission;
