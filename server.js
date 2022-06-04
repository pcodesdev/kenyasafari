// Start the server
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// uncaughtException
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(' UNCAUGHT EXCEPTION!  🎗  SHUTTING DOWN');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// using the config file

// Getting Environment Variables
// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connecton successful!'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Server errors
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION !  🎗  SHUTTING DOWN');
  server.close(() => {
    process.exit(1);
  });
});
