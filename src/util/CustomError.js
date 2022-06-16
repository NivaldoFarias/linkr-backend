import http from 'http';

class CustomError extends Error {
  constructor(statusCode, message, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.statusMessage = http.STATUS_CODES[statusCode];
  }
};

export default CustomError;
