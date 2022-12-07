import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import UserRequestInterface from '../Types/UserRequestInterface';
import { User } from '../models/userModel';

// @desc    middleware for checking if user is authorized
// @route   GET /getuser

const userProtect = asyncHandler(
  async (req: UserRequestInterface, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer')) {
      //Get token from header
      token = req.headers.authorization.split(' ')[1];

      const tokenSecret = process.env.JWT_ACCESS_TOKEN as string;
      //verify token

      jwt.verify(token, tokenSecret, async (err, payload: any) => {
        try {
          if (err) {
            res.status(400);
            throw new Error('Not authorized');
          }
          const userDetails = await User.findById(payload.id);
          if (!userDetails) {
            res.status(400);
            throw new Error("Can't find user login again");
          }
          req.userDetails = userDetails;
          next();
        } catch (error) {
          next(error);
        }
      });
    } else {
      res.status(400);
      throw new Error('Please login first');
    }
  }
);

export default userProtect;
