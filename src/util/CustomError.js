import 'http';

class CustomError {
  statusCode;
  message;
  details;
  constructor(statusCode, message, details = {}) {
    this.statusCode = statusCode;
    this.statusMessage = http.STATUS_CODES[statusCode];
    this.message = message;
    this.details = details;
  }
}

export default CustomError;
