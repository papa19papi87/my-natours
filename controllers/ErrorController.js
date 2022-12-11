const AppError = require('../utils/appError');

const handlecastErrorDB = (err) => {
  const message = `Invalid  ${err.path}: ${err.val}.`;
  return new AppError(message, 404);
};

const handleDuplicateFields = (err) => {
  const value = err.ermsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = Duplicate`fields values: ${value}. please use another value!`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  const errors = object.values(err.error).map((el) => el.message);
  const message = `Invalid imput data. ${errors.join('.')}`;
  return new AppError(message, 404);
};
const handleJWTError = (err) =>
  new AppError('invalid toke please login again', 401);

const handleJWTEpiredError = (err) =>
  new AppError('invalid toke please login again', 401);

const sendErrorDev = (err, req, res) => {
  // A) Api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //B) RENDERED WEBSITE
  // we are doing this here bc we are in dev bc here we leake all error and i will not matter but ccant be done in prod
  console.log('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'something went wrong!',
    msg: err.message,
  });
};

const sendErrorprod = (err, req, res) => {
  //  A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.IsOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // 1) B) log error
    console.log('ERROR', err);
    // 2) send generic message
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
  //A) FOR THRE RENDERED WEBSITE

  if (err.IsOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'somthing went wrong',
      msg: err.message,
    });
  }
  // 1)B) log error
  console.log('ERROR', err);
  // 2) send generic message
  return res.status(err.statusCode).render('error', {
    title: 'somthing went wrong',
    msg: 'please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'castError') err = handlecastErrorDB(error);
    if (err.code === 11000) err = handleDuplicateFields(error);
    if (err.name === 'validation') error = handleValidationErrorDB(error);
    if (error.name === 'jwtwebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTEpiredError();
    console.log(error.message);
    console.log(err.message);

    sendErrorprod(error, req, res);
  }
};
