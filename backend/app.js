import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';

//importing mongoconnect function
import db from './helpers/db.js';

//importing error handling middleware
import errorHandler from './middlewares/errorHandler.js';

//importing routes
import indexRouter from './routes/index.js';
import adminRouter from './routes/admin.js';

//linking config file
config({ path: './config.env' });

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

//setting up cors
app.use(
   cors({
      origin: 'http://localhost:3000'
   })
);

//connecting to database
db.initDb((err, _db) => {
   if (err) {
      console.log(err);
   } else {
      console.log(`MongoDB Connection successful \n \n `.magenta);
   }
});

//setting routes
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
   next(createError(404));
});

// error handler
app.use(errorHandler);

export default app;
