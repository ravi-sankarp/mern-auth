import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminHomeLayout from '../components/Admin/AdminHomeLayout';
import { selectAdminAuth } from '../redux/features/reducers/adminAuthSlice';

function AdminHome() {
  const data = useSelector(selectAdminAuth);
  if (data.token) {
    if (data.admin === true) {
      return <AdminHomeLayout />;
    } 
  }
  return <Navigate to="/admin/login" />;
}

export default AdminHome;
