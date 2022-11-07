const { StatusCodes } = require('http-status-codes');
const customError = require('./customError');

class BadRequestError extends customError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
