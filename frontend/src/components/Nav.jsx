import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Button, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteToken } from '../redux/features/reducers/authSlice';

function Nav() {
   const data = useSelector((state) => state.auth.data);

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const handleLogout = () => {
      dispatch(deleteToken());
      navigate('/login');
   };
   return (
      <Navbar bg="dark" variant="dark" fixed="top">
         <Container>
            <Link to="/">
               <Navbar.Brand>Home</Navbar.Brand>
            </Link>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
               {data.token ? (
                  <Navbar.Text>
                     <Button onClick={handleLogout}>Logout</Button>
                  </Navbar.Text>
               ) : (
                  <>
                     <Navbar.Text>
                        <Link to="/login">
                           <Button>Login</Button>
                        </Link>
                     </Navbar.Text>
                     <Navbar.Text className="ms-4">
                        <Link to="/register">
                           <Button>Register</Button>
                        </Link>
                     </Navbar.Text>
                  </>
               )}
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
}

export default Nav;
