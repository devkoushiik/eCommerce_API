const CustomError = require('../errors');
const { isTokenValid } = require('../utils/jwt');
const authenticationUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
      throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
    try {
      const userToken = isTokenValid({ token });
      req.user = userToken;
      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
}

const authenticationAdmin = (...roles) => {
   return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
        throw new CustomError.UnAuthorizedError('Unauthorized to access this route')
       }
       next()
   }
}

module.exports = {authenticationUser,authenticationAdmin}