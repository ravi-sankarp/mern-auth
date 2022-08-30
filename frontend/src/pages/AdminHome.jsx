import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminHomeLayout from '../components/Admin/AdminHomeLayout';

function AdminHome() {
   const data = useSelector((state) => state.auth.data);
   if (data.token) {
      if (data.admin === true) {
         return <AdminHomeLayout />;
      }
   }
   return <Navigate to="/" />;
}

export default AdminHome;
