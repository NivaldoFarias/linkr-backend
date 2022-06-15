import CustomError from '../util/CustomError.js';

function ErrorHandler(error, _req, res, _next) {
  error instanceof CustomError
    ? res.status(error.statusCode).send({
        message: error.message,
        details: error.details,
      })
    : res.status(500).send({
        message: `Internal server error`,
        details: error,
      });
}

export default ErrorHandler;
