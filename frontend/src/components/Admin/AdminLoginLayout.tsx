/* eslint-disable react/jsx-props-no-spreading */
import { Button, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAdminLoginMutation } from '../../redux/features/api/apiSlice';
import { ILoginPayload } from '../../Types/UserInterface';
import { setAdminToken } from '../../redux/features/reducers/adminAuthSlice';

function AdminLoginLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userLogin, { isLoading }] = useAdminLoginMutation();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginPayload>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const formSubmit: SubmitHandler<ILoginPayload> = async (data) => {
    if (!isLoading) {
      try {
        const res = await userLogin(data).unwrap();
        if (res.status === 'Success') {
          dispatch(setAdminToken(res));
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
          navigate('/admin/home');
        }
      } catch (err: any) {
        if (err?.data?.message) {
          toast.error(`${err?.data?.message}`, {
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
    }
  };
  return (
    <div className="container-register">
      <Form
        onSubmit={handleSubmit(formSubmit)}
        autoComplete="off"
        noValidate={true}
      >
        <div className="text-center fx-bolder text-primary h3">ADMIN LOGIN</div>
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

        <Button
          variant="primary"
          type="submit"
        >
          Login
        </Button>
      </Form>
    </div>
  );
}

export default AdminLoginLayout;
