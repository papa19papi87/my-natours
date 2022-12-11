const app = require('./app');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

// // process.on('uncaugthException', (err) => {
// //   console.log(err.name, err.message);
// //   console.log('UNCAUGTH EXCEPTION!  shutting down');
// //   process.exit(1);
// });
process.on('SIGTERM', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGTH EXCEPTION!  shutting down');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSEWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log('DB CONNECTION SUCCESSFUL!');
  });
const port = process.env.PORT || 4000;
app.listen(8001, () => {
  console.log(`App runing on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!  shutting down');
  server.close(() => {
    process.exit(1);
  });
});
