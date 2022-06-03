const createTokenUser = ({ name, _id: userId }) => {
  return { name, userId };
};

module.exports = createTokenUser;
