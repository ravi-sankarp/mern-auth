import asyncHandler from 'express-async-handler';
import validator from 'validator';
import brcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/userModel';
import UserInterface from '../Types/UserInterface';
import userInfoReq from '../Types/UserRequestInterface';

//generate jwt token
const generateToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN as string, {
    expiresIn: process.env.JWT_EXPIRY
  });

const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!(email && password)) {
    res.status(400);
    throw new Error('Enter all fields');
  }

  //checking if account exists
  const user: UserInterface | null = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(400);
    throw new Error('Invalid email address');
  } else if (!user.admin) {
    res.status(401);
    throw new Error('Not an admin ');
  } else if (await brcypt.compare(password, user.password as string)) {
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

const getUserData = asyncHandler(async (req: userInfoReq, res: Response) => {
  if (!req?.userDetails?.admin) {
    res.status(401);
    throw new Error('Not Authorized to access this route');
  }

  const users: UserInterface[] = await User.find({ admin: false }).select('-__v');
  res.json({
    status: 'Success',
    users
  });
});

const editUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, phoneNumber, firstName, lastName } = req.body;

  //checking if the entered data is valid
  if (!(email && firstName && lastName && phoneNumber)) {
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
  const findUser = await User.findOne({ _id: { $ne: req.params.id }, email });
  if (findUser) {
    res.status(400);
    throw new Error('Email already exists');
  }
  await User.updateOne(
    { _id: req.params.id },
    { $set: { email, firstName, lastName, phoneNumber } },
    { runValidators: true }
  );
  res.json({ status: 'Success' });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await User.deleteOne({ _id: req.params.id });
  res.json({ status: 'success' });
});

const getSingleUserData = asyncHandler(async (req: Request, res: Response) => {
  const userDetails: UserInterface | null = await User.findOne({ _id: req.params.id });
  console.log({userDetails});
  res.json({
    id: userDetails?._id,
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    email: userDetails?.email,
    phoneNumber: userDetails?.phoneNumber
  });
});

const addNewUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, confirmPassword, firstName, lastName, phoneNumber } = <
    UserInterface & { confirmPassword: string }
  >req.body;

  // checking if the entered data is valid
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
  await User.create({
    email,
    firstName,
    lastName,
    phoneNumber,
    password
  });

  res.json({ status: 'Success' });
});

export default {
  adminLogin,
  getUserData,
  editUser,
  deleteUser,
  addNewUser,
  getSingleUserData
};
