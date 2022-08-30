import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';
import Nav from './components/Nav';
import AdminAddUser from './pages/AdminAddUser';
import AdminEditUser from './pages/AdminEditUser';

function App() {
   return (
      <Router>
         <Nav />
         <Routes>
            <Route path="/" exact element={<UserHome />} />
            <Route path="/login" index element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/adminaddnew" element={<AdminAddUser />} />
            <Route path="/edituser/:id" element={<AdminEditUser />} />
         </Routes>
         <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
         />
      </Router>
   );
}

export default App;
