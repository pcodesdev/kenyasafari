const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// Setting Security Header
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Global Middleware
// Set Security HTTP Header
app.use(helmet());
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Api late limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again later!',
});
app.use('/api', limiter);

// Body parser, reading the data in the body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Get all the tours
// app.get('/api/v1/tours', getAllTours);

// // Get the tour by an ID
// app.get('/api/v1/tours/:id', getTour);

// // Post a new tour to the json file[B]
// app.post('/api/v1/tours', createTour);

// // Update data
// app.patch('/api/v1/tours/:id', updateTour);

// // Delete data
// app.delete('/api/v1/tours/:id', deleteTour);

// Routes

//

// mounting the routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Cannot find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
