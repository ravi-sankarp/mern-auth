import express from 'express';
import userController from '../controllers/userController';
import userProtect from '../middlewares/authMiddleware';

const router = express.Router();


//Route for user login
router.post('/login', userController.userLogin);

//Route for user registration
router.post('/register',userController.registerUser);

//Route for getting user data
router.get('/getuser',userProtect,userController.getUserData);


export default router;
