const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitiser = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookiePerser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const globALErrorHandler = require('./controllers/ErrorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.use(morgan('dev'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(
  cors({
    origin: 'http://www.section.io',
  })
);

// global midlewares
// service statics
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

if (process.env.NODE.ENV === 'development') {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'script-src': ["'self'", 'example.com'],
        'style-src': null,
        'connect-src': 'self',
      },
    })
  );
}

const limiter = rateLimit({
  max: 20,
  window: 60 * 60 * 100,
  message: 'too many request from this Ip, please try again in an hour',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookiePerser());

app.use(mongoSanitiser());

app.use(xss());

app.use(
  hpp({
    whiteList: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}on this server!`, 400));
});

app.use(globALErrorHandler);

module.exports = app;
