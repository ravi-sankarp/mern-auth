/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useAdminAddNewMutation } from '../../redux/features/api/apiSlice';

import '../SignUp/signup.css';
import { IRegisterPayload } from '../../Types/UserInterface';

function AddUser() {
  const navigate = useNavigate();

  const [adminAddNew, { isLoading }] = useAdminAddNewMutation();

  const schema = yup.object().shape({
    firstName: yup.string().min(4).max(6).required('First Name is required '),
    lastName: yup.string().min(1).max(6).required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().matches(/^[6-9]\d{9}$/, 'Enter a valid phone number'),
    password: yup.string().min(4).max(15).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IRegisterPayload>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const formSubmit: SubmitHandler<IRegisterPayload> = async (data) => {
    if (!isLoading) {
      try {
        const res = await adminAddNew(data).unwrap();
        console.log(res);
        if (res.status === 'Success') {
          toast.success('Added New User', {
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            closeButton: true
          });
          navigate('/admin/home');
        }
      } catch (err: any) {
        console.log(err);
        toast.error(`${err?.data.message}`, {
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
      <Form
        onSubmit={handleSubmit(formSubmit)}
        autoComplete="off"
        noValidate={true}
      >
        <div className="text-center fx-bolder text-primary h3">ADD USER</div>
        <Form.Group
          className="mb-3"
          controlId="formBasicFirstName"
        >
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First name"
            {...register('firstName')}
          />
        </Form.Group>

        <p>{errors.firstName?.message}</p>

        <Form.Group
          className="mb-3"
          controlId="formBasicSecondName"
        >
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            {...register('lastName')}
          />
        </Form.Group>

        <p>{errors.lastName?.message}</p>

        <Form.Group
          className="mb-3"
          controlId="formBasicEmail"
        >
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register('email')}
          />
        </Form.Group>

        <p>{errors.email?.message}</p>

        <Form.Group
          className="mb-3"
          controlId="formBasicPhone"
        >
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Phone Number"
            {...register('phoneNumber')}
          />
        </Form.Group>

        <p>{errors.phoneNumber?.message}</p>

        <Form.Group
          className="mb-3"
          controlId="formBasicPassword"
        >
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register('password')}
          />
        </Form.Group>

        <p>{errors.password?.message}</p>

        <Form.Group
          className="mb-3"
          controlId="formBasicConfirmPassword"
        >
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register('confirmPassword')}
          />
        </Form.Group>

        <p>{errors.confirmPassword?.message}</p>

        <Button
          variant="primary"
          type="submit"
        >
          Register
        </Button>
      </Form>
    </div>
  );
}

export default AddUser;
