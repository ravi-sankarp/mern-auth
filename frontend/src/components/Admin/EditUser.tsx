/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Form, Spinner } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {
  useAdminEditUserMutation,
  useAdminGetSingleUserDataQuery
} from '../../redux/features/api/apiSlice';
import { IRegisterPayload } from '../../Types/UserInterface';

function EditUser() {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const { data, isLoading, isFetching } = useAdminGetSingleUserDataQuery({ id });
  const [adminEditUser, { isLoading: isLoadingMutation }] = useAdminEditUserMutation();

  const schema = yup.object().shape({
    firstName: yup.string().min(4).max(6).required('First Name is required '),
    lastName: yup.string().min(1).max(6).required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().matches(/^[6-9]\d{9}$/, 'Enter a valid phone number')
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
    if (!isLoadingMutation) {
      try {
        const res = await adminEditUser({ data, id }).unwrap();
        console.log(res);
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
          navigate('/admin/home');
        }
      } catch (err:any) {
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
  if (isLoading || isFetching) {
    return (
      <div className="d-flex align-items-center gap-3">
        <Spinner
          animation="border"
          role="status"
        />
        <span className="">Loading...</span>
      </div>
    );
  }
  return (
    <div className="mt-5 container-register">
      <Form
        onSubmit={handleSubmit(formSubmit)}
        autoComplete="off"
        noValidate={true}
      >
        <div className="text-center fx-bolder text-primary h3">UPDATE USER</div>
        <Form.Group
          className="mb-3"
          controlId="formBasicFirstName"
        >
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First name"
            {...register('firstName')}
            defaultValue={data?.firstName}
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
            defaultValue={data?.lastName}
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
            defaultValue={data?.email}
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
            defaultValue={data?.phoneNumber}
          />
        </Form.Group>

        <p>{errors.phoneNumber?.message}</p>
        <Button
          variant="primary"
          type="submit"
        >
          Update
        </Button>
      </Form>
    </div>
  );
}

export default EditUser;
