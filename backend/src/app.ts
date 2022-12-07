import createError from 'http-errors';
import express, { json, urlencoded, Application } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';
import 'express-async-errors';

//importing mongoose connection function
import dbConnection from './utils/db';

//importing error handling middleware
import errorHandler from './middlewares/errorHandler';

//importing routes
import indexRouter from './routes/index.js';
import adminRouter from './routes/admin.js';
// @ts-ignore
import { Color } from 'colors/index.js';

//linking config file
config({ path: './config.env' });

const app: Application = express();
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.disable('x-powered-by');

//setting up cors
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

//setting up database connection
dbConnection();

//setting routes
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(errorHandler);

const port = process.env.port || 8000;

const server = app.listen(port, () => {
  console.log(`\nServer running on port ${port} \n`.magenta);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
