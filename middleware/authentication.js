const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  try {
    if (!token) {
      throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
    const payload = isTokenValid(token);
    req.user = payload.user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new CustomError.UnauthorizedError(
          "Unauthorized to access this route"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authenticateUser, authorizeRoles };
