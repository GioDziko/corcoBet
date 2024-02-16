const jwt = require("jsonwebtoken");
const { createUnauthenticatedError } = require("../errors/unauthenticated");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(createUnauthenticatedError("Authentication invalid"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (error) {
    return next(createUnauthenticatedError("Authentication invalid"));
  }
};

module.exports = auth;
