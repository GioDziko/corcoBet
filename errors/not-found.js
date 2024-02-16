const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("./custom-errors");

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

const createNotFoundError = (msg) => {
  return new NotFoundError(msg);
};

module.exports = { createNotFoundError };
