const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const comparePassword = async function (candidatePassword, realPassword) {
  const isMatch = await bcrypt.compare(candidatePassword, realPassword);
  return isMatch;
};

const createJWT = function (user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

module.exports = {
  comparePassword,
  createJWT,
};
