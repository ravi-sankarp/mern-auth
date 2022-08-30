import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Home from '../components/home/Home';

function UserHome() {
   const data = useSelector((state) => state.auth.data);
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
   if (data.admin === true) {
         return <Navigate to="/adminhome" />;
   }
   return <Home />;
}

export default UserHome;
