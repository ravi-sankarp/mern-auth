import mongoose from 'mongoose';
import { config } from 'dotenv';
// @ts-ignore
import { Color } from 'colors/index.js';

config({ path: './config.env' });

const mongoUrl = process.env.DATABASE_LOCAL as string;

const dbConnection = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('DB connection successful!'.green);
  } catch (err: any) {
    console.log(`Db Connection Failed ! ${err.message}`.red);
  }
};

export default dbConnection;
