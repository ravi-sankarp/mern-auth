import asyncHandler from 'express-async-handler';
import validator from 'validator';
import mongodb from 'mongodb';
import brcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoConnection from '../helpers/db.js';

const { getDb } = mongoConnection;

// function for hashing passwords
const hashPwd = async (pwd) => {
   const hashedPwd = await brcypt.hash(pwd, 12);
   return hashedPwd;
};

//generate jwt token
const generateToken = (id) =>
   jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.JWT_EXPIRY });

const adminLogin = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      res.status(400);
      throw new Error('Enter all fields');
   }

   //checking if account exists
   const user = await getDb().db().collection('users').findOne({ email });
   if (!user) {
      res.status(400);
      throw new Error('Invalid email address');
   } else if (!user.admin) {
      res.status(401);
      throw new Error('Not an admin ');
   } else if (await brcypt.compare(password, user.password)) {
      res.json({
         status: 'Success',
         token: generateToken(user._id),
         admin: true
      });
   } else {
      res.status(400);
      throw new Error('Invalid credentials');
   }
});

const getUserData = asyncHandler(async (req, res) => {
   if (!req.userDetails.admin) {
      res.status(401);
      throw new Error('Not Authorized to access this route');
   }
   const users = [];
   await getDb()
      .db()
      .collection('users')
      .find({ admin: { $exists: false } })
      .project({ password: 0 })
      .forEach((user) => {
         user._id = user._id.toString();
         users.push(user);
      });
   res.json({
      status: 'Success',
      users
   });
});

const editUser = asyncHandler(async (req, res) => {
   const { email, phoneNumber, firstName, lastName } = req.body;

   //checking if the entered data is valid
   if (!email || !firstName || !lastName || !phoneNumber) {
      res.status(400);
      throw new Error('All fields are required');
   }

   if (!validator.isEmail(email)) {
      res.status(400);
      throw new Error('Email not valid');
   }
   if (!validator.isMobilePhone(phoneNumber, 'en-IN')) {
      res.status(400);
      throw new Error('Enter a valid Phone number');
   }

   //checking if email already exists
   const findUser = await getDb()
      .db()
      .collection('users')
      .findOne({ _id: { $ne: mongodb.ObjectId(req.params.id) }, email });
   if (findUser) {
      res.status(400);
      throw new Error('Email already exists');
   }
   await getDb()
      .db()
      .collection('users')
      .updateOne(
         { _id: mongodb.ObjectId(req.params.id) },
         { $set: { email, firstName, lastName, phoneNumber } }
      );
   res.json({ status: 'Success' });
});

const deleteUser = asyncHandler(async (req, res) => {
   await getDb()
      .db()
      .collection('users')
      .deleteOne({ _id: mongodb.ObjectId(req.params.id) });
   res.json({ status: 'success' });
});

const addNewUser = asyncHandler(async (req, res) => {
   const { email, password, confirmPassword, firstName, lastName, phoneNumber } = req.body;

   //checking if the entered data is valid
   if (!email || !password || !firstName || !lastName || !phoneNumber || !confirmPassword) {
      res.status(400);
      throw new Error('All fields are required');
   }
   if (password !== confirmPassword) {
      res.status(400);
      throw new Error(`Both passwords doesn't match`);
   }
   if (!validator.isEmail(email)) {
      res.status(400);
      throw new Error('Email not valid');
   }
   if (!validator.isMobilePhone(phoneNumber, 'en-IN')) {
      res.status(400);
      throw new Error('Enter a valid Phone number');
   }

   //checking if email already exists
   const findUser = await getDb().db().collection('users').findOne({ email });
   if (findUser) {
      res.status(409);
      throw new Error('Email already exists');
   }
   const hashedPassword = await hashPwd(password);
   await getDb()
      .db()
      .collection('users')
      .insertOne({ email, firstName, lastName, phoneNumber, password: hashedPassword });

   res.json({ status: 'Success' });
});

export default {
   adminLogin,
   getUserData,
   editUser,
   deleteUser,
   addNewUser
};
