import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminLoginLayout from '../components/Admin/AdminLoginLayout';

function AdminLogin() {
   const data = useSelector((state) => state.auth.data);
   if (data.token) {
      if (data.admin === true) {
         return <Navigate to="/adminhome" />;
      }
      return <Navigate to="/" />;
   }
   return <AdminLoginLayout />;
}

export default AdminLogin;
