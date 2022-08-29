import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import mongodb from 'mongodb';
import mongoConnection from '../helpers/db.js';

// @desc    middleware for checking if user is authorized
// @route   GET /getuser

const userProtect = asyncHandler(async (req, res, next) => {
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      //Get token from header
      token = req.headers.authorization.split(' ')[1];

      //verify token
      jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, payload) => {
         try {
         if (err) {
            res.status(400);
            throw new Error('Not authorized');
         }
            const userDetails = await mongoConnection
               .getDb()
               .db()
               .collection('users')
               .findOne({ _id: mongodb.ObjectId(payload.id) });
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
});

export default userProtect;
