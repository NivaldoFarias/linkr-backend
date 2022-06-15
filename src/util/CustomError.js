import 'http';

class CustomError {
  constructor(statusCode, message, details = '') {
    this.statusCode = statusCode;
    this.statusMessage = http.STATUS_CODES[statusCode];
    this.message = message;
    this.details = details;
  }
}

CustomError.prototype = new Error();

export default CustomError;
