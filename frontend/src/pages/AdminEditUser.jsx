import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import EditUser from '../components/Admin/EditUser';

function AdminEditUser() {
   const data = useSelector((state) => state.auth.data);
   if (data.token) {
      if (data.admin === true) {
         return <EditUser />;
      }
   }
   return <Navigate to="/" />;
}

export default AdminEditUser;
