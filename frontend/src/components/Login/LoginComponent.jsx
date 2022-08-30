/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUserLoginMutation } from '../../redux/features/api/apiSlice';
import { setToken } from '../../redux/features/reducers/authSlice';

import './Login.css';

function LoginComponent() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [userLogin, { isLoading }] = useUserLoginMutation();
   const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required()
   });
   const {
      register,
      handleSubmit,
      formState: { errors }
   } = useForm({
      resolver: yupResolver(schema),
      mode: 'onChange'
   });
   const formSubmit = async ({ email, password }) => {
      if (!isLoading) {
         try {
            const res = await userLogin({ email, password }).unwrap();
            if (res.status === 'Success') {
               dispatch(setToken(res));
               toast.success('Login Successfull', {
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
            toast.error(`${err.data.message}`, {
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
      <div className="container-register">
         <Form onSubmit={handleSubmit(formSubmit)} autoComplete="off" noValidate>
            <div className="text-center fx-bolder text-primary h3">LOGIN</div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
               <Form.Label>Email address</Form.Label>
               <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  {...register('email')}
               />
            </Form.Group>

            <p>{errors.email?.message}</p>

            <Form.Group className="mb-3" controlId="formBasicPassword">
               <Form.Label>Password</Form.Label>
               <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  {...register('password')}
               />
            </Form.Group>
            <p>{errors.password?.message}</p>

            <Button variant="primary" type="submit">
               Login
            </Button>
         </Form>
      </div>
   );
}

export default LoginComponent;