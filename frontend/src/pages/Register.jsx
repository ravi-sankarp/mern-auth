import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import SignUp from '../components/SignUp/SignUp';

function Register() {
   const data = useSelector((state) => state.auth.data);
   if (data.token) {
      if (data.admin === true) {
         return <Navigate to="/adminhome" />;
      }
      return <Navigate to="/" />;
   }

   return <SignUp />;
}

export default Register;
