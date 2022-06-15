import CustomError from '../util/CustomError.js';

const ErrorHandler = (err, _req, res, _next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send(err.message);
  } else {
    res.status(500).send(err.message);
  }
};

export default ErrorHandler;
