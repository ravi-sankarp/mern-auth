import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import EditUser from '../components/Admin/EditUser';
import { selectAdminAuth } from '../redux/features/reducers/adminAuthSlice';

function AdminEditUser() {
  const data = useSelector(selectAdminAuth);
  if (data.token) {
    if (data.admin === true) {
      return <EditUser />;
    }
  }
  return <Navigate to="/admin/login" />;
}

export default AdminEditUser;
