import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminLoginLayout from '../components/Admin/AdminLoginLayout';
import { selectAdminAuth } from '../redux/features/reducers/adminAuthSlice';

function AdminLogin() {
  const data = useSelector(selectAdminAuth);
  if (data.token) {
    if (data.admin === true) {
      return <Navigate to="/admin/home" />;
    }
  }
  return <AdminLoginLayout />;
}

export default AdminLogin;
