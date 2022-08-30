import asyncHandler from 'express-async-handler';
import validator from 'validator';
import brcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoConnection from '../helpers/db.js';

const { getDb } = mongoConnection;

//function for hashing passwords
const hashPwd = async (pwd) => {
   const hashedPwd = await brcypt.hash(pwd, 12);
   return hashedPwd;
};

//generate jwt token
const generateToken = (id) =>
   jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.JWT_EXPIRY });

//@desc  handle userlogin
//@route POST /login
//@access public
const userLogin = asyncHandler(async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      res.status(400);
      throw new Error('Enter all fields');
   }

   //checking if account exists
   const user = await getDb().db().collection('users').findOne({ email });
   if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
   } else if (await brcypt.compare(password, user.password)) {
      res.json({
         status: 'Success',
         token: generateToken(user._id),
         admin: false
      });
   } else {
      res.status(401);
      throw new Error('Invalid credentials');
   }
});

//@desc  handle User registration
//@route POST /register
//@access public
const registerUser = asyncHandler(async (req, res) => {
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
   const result = await getDb()
      .db()
      .collection('users')
      .insertOne({ email, firstName, lastName, phoneNumber, password: hashedPassword });

   res.json({ status: 'Success', token: generateToken(result.insertedId), admin: false });
});

//get user details
const getUserData = asyncHandler(async (req, res) => {
   const { userDetails } = req;
   res.json({
      id: userDetails._id,
      name: userDetails.firstName.concat(' ', userDetails.lastName),
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber
   });
});
export default {
   userLogin,
   registerUser,
   getUserData
};
