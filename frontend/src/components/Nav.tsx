import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Button, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteToken, selectUserAuth } from '../redux/features/reducers/authSlice';
import { deleteAdminToken, selectAdminAuth } from '../redux/features/reducers/adminAuthSlice';

function Nav() {
  const { pathname } = useLocation();
  const { token: adminToken } = useSelector(selectAdminAuth);
  const { token: userToken } = useSelector(selectUserAuth);
  const isAdmin = pathname.split('/').includes('admin') ? true : false;
  const token = isAdmin ? adminToken : userToken;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    if (isAdmin) {
      dispatch(deleteAdminToken());
      navigate('/admin/login');
    } else {
      dispatch(deleteToken());
      navigate('/login');
    }
  };
  return (
    <Navbar
      bg="dark"
      variant="dark"
      fixed="top"
    >
      <Container>
        <Link to="/">
          <Navbar.Brand>Home</Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {token ? (
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
