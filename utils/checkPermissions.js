const CustomError = require("../errors");

const checkPermissions = (userId, userIdFromItem) => {
  if (userId !== userIdFromItem)
    throw new CustomError.UnauthorizedError("Forbidden");
};

module.exports = checkPermissions;
