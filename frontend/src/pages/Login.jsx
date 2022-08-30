import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoginComponent from '../components/Login/LoginComponent';

function Login() {
   const data = useSelector((state) => state.auth.data);
   if (data.token) {
      if (data.admin === true) {
         return <Navigate to="/adminhome" />;
      }
      return <Navigate to="/" />;
   }

   return <LoginComponent />;
}

export default Login;
