/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useAdminEditUserMutation } from '../../redux/features/api/apiSlice';

function EditUser() {
   const navigate = useNavigate();
   const params = useParams();
   console.log(params);
   const [adminEditUser, { isLoading }] = useAdminEditUserMutation();

   const schema = yup.object().shape({
      firstName: yup.string().min(4).required('First Name is required '),
      lastName: yup.string().min(1).required(),
      email: yup.string().email().required(),
      phoneNumber: yup.string().matches(/^[6-9]\d{9}$/, 'Enter a valid phone number')
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
            const res = await adminEditUser({ data, id: params.id }).unwrap();
            if (res.status === 'Success') {
               toast.success('Updated User', {
                  position: 'bottom-right',
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  closeButton: true
               });
               navigate('/adminhome');
            }
         } catch (err) {
            console.log(err);
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
      <div className="mt-5 container-register">
         <Form onSubmit={handleSubmit(formSubmit)} autoComplete="off" noValidate>
            <div className="text-center fx-bolder text-primary h3">UPDATE USER</div>
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
            <Button variant="primary" type="submit">
               Update
            </Button>
         </Form>
      </div>
   );
}

export default EditUser;
