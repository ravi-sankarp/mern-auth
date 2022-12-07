import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import userInfoReq from '../Types/UserRequestInterface';
import passwordHelper from '../utils/PasswordHelper';
import UserInterface from '../Types/UserInterface';

//generate jwt token
const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN as string, {
    expiresIn: process.env.JWT_EXPIRY
  });

//@desc  handle userlogin
//@route POST /login
//@access public
const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  if (!(email && password)) {
    res.status(400);
    throw new Error('Enter all fields');
  }

  //checking if account exists
  const user: UserInterface | null = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  } else if (await passwordHelper.comparePassword(password, user.password as string)) {
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
const registerUser = asyncHandler(async (req: userInfoReq, res: Response) => {
  const { email, password, confirmPassword, firstName, lastName, phoneNumber } = <
    UserInterface & { confirmPassword: string }
  >req.body;

  //checking if the entered data is valid
  if (!(email && password && firstName && lastName && phoneNumber && confirmPassword)) {
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
  const findUser: UserInterface | null = await User.findOne({ email });
  if (findUser) {
    res.status(409);
    throw new Error('Email already exists');
  }
  const result = await User.create({
    email,
    firstName,
    lastName,
    phoneNumber,
    password,
    admin: false
  });

  res.json({
    status: 'Success',
    token: generateToken(result._id),
    admin: false
  });
});

//get user details
const getUserData = asyncHandler(async (req: userInfoReq, res: Response) => {
  const { userDetails } = req;
  res.json({
    id: userDetails?._id,
    name: userDetails?.firstName.concat(' ', userDetails.lastName),
    email: userDetails?.email,
    phoneNumber: userDetails?.phoneNumber
  });
});
export default {
  userLogin,
  registerUser,
  getUserData
};
