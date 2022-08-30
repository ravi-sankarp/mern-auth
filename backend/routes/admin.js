import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import adminProtect from '../middlewares/authMiddleware.js';

const router = Router();

/* GET users listing. */
router.post('/login', adminController.adminLogin);

//route to get user data for the admin
router.get('/getuserdata', adminProtect, adminController.getUserData);

//route for adding new users
router.post('/addnewuser', adminProtect, adminController.addNewUser);


//route for editing user data
router.put('/edituserdata/:id', adminProtect, adminController.editUser);

//route for deleting user
router.delete('/deleteuser/:id', adminProtect, adminController.deleteUser);

export default router;
