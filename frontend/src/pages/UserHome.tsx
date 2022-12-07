import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Home from '../components/home/Home';
import { selectUserAuth } from '../redux/features/reducers/authSlice';

function UserHome() {
  const data = useSelector(selectUserAuth);
  const showToast = () => {
    toast.warning('Login to continue', {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: true
    });
  };
  if (!data.token) {
    return (
      <>
        {showToast()}
        <Navigate to="/login" />
      </>
    );
  }
  return <Home />;
}

export default UserHome;
