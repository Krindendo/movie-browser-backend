const checkPermissions = (userEmail, userEmailFromItem) => {
  if (userEmail === userEmailFromItem) return true;
  return false;
};

module.exports = checkPermissions;
