const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors/custom-errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    console.log(`Custom error | ${err.message}`);
    return res
      .status(err.statusCode)
      .json({ success: false, msg: err.message });
  }

  console.log(`Internal Server error | ${err.message}`);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, msg: err.message });
};

module.exports = { errorHandlerMiddleware };
