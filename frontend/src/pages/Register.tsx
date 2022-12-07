import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import SignUp from '../components/SignUp/SignUp';
import { selectUserAuth } from '../redux/features/reducers/authSlice';

function Register() {
  const data = useSelector(selectUserAuth);
  if (data.token) {
    return <Navigate to="/" />;
  }

  return <SignUp />;
}

export default Register;
