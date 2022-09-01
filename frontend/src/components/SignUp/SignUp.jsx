/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useUserSignupMutation } from '../../redux/features/api/apiSlice';
import { setToken } from '../../redux/features/reducers/authSlice';

import './signup.css';

function SignUp() {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [userSignup, { isLoading }] = useUserSignupMutation();

   const schema = yup.object().shape({
      firstName: yup.string().min(4).required('First Name is required '),
      lastName: yup.string().min(1).required(),
      email: yup.string().email().required(),
      phoneNumber: yup.string().matches(/^[6-9]\d{9}$/, 'Enter a valid phone number'),
      password: yup.string().min(4).max(15).required(),
      confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
   });
   const {
      register,
      handleSubmit,
      formState: { errors }
   } = useForm({
      resolver: yupResolver(schema),
      mode: 'onChange'
   });

   const formSubmit = async (data) => {
      if (!isLoading) {
         try {
            const res = await userSignup(data).unwrap();
            if (res.status === 'Success') {
               dispatch(setToken({ token: res.token, admin: res.admin }));
               toast.success('Registration Successfull', {
                  position: 'bottom-right',
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  closeButton: true
               });
               navigate('/');
            }
         } catch (err) {
            console.log(err);
            const error = err.data.message;
            toast.error(error, {
               position: 'bottom-right',
               autoClose: 2000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: 'colored',
               closeButton: true
            });
         }
      }
   };
   return (
      <div className="mt-5 container-register">
         <Form onSubmit={handleSubmit(formSubmit)} autoComplete="off" noValidate>
            <div className="text-center fx-bolder text-primary h3">REGISTER</div>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
               <Form.Label>First Name</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="First name"
                  name="firstName"
                  {...register('firstName')}
               />
            </Form.Group>

            <p>{errors.firstName?.message}</p>

            <Form.Group className="mb-3" controlId="formBasicSecondName">
               <Form.Label>Last Name</Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  {...register('lastName')}
               />
            </Form.Group>

            <p>{errors.lastName?.message}</p>

            <Form.Group className="mb-3" controlId="formBasicEmail">
               <Form.Label>Email address</Form.Label>
               <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  {...register('email')}
               />
            </Form.Group>

            <p>{errors.email?.message}</p>

            <Form.Group className="mb-3" controlId="formBasicPhone">
               <Form.Label>Phone Number</Form.Label>
               <Form.Control
                  type="number"
                  placeholder="Enter Phone Number"
                  name="phoneNumber"
                  {...register('phoneNumber')}
               />
            </Form.Group>

            <p>{errors.phoneNumber?.message}</p>

            <Form.Group className="mb-3" controlId="formBasicPassword">
               <Form.Label>Password</Form.Label>
               <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  {...register('password')}
               />
            </Form.Group>

            <p>{errors.password?.message}</p>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
               <Form.Label>Confirm Password</Form.Label>
               <Form.Control
                  type="password"
                  placeholder="Password"
                  name="confirmPassword"
                  {...register('confirmPassword')}
               />
            </Form.Group>

            <p>{errors.confirmPassword?.message}</p>

            <Button variant="primary" type="submit">
               Register
            </Button>
         </Form>
      </div>
   );
}

export default SignUp;
