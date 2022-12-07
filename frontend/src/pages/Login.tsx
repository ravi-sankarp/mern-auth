import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoginComponent from '../components/Login/LoginComponent';
import { selectUserAuth } from '../redux/features/reducers/authSlice';

function Login() {
  const data = useSelector(selectUserAuth);
  if (data.token) {
    return <Navigate to="/" />;
  }

  return <LoginComponent />;
}

export default Login;
