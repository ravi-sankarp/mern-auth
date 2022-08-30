/* eslint-disable max-len */
import { Button, Spinner, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetUserDataQuery } from '../../redux/features/api/apiSlice';
import { deleteToken } from '../../redux/features/reducers/authSlice';
import './home.css';

function Home() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useGetUserDataQuery();
   let content;
   if (isLoading || isFetching) {
      content = (
         <div className="d-flex align-items-center gap-3">
            <Spinner animation="border" role="status" />
            <span className="">Loading...</span>
         </div>
      );
   } else if (isSuccess) {
      console.log(data);
      content = (
         <Table striped bordered hover>
            <thead>
               <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>1</td>
                  <td>{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.phoneNumber}</td>
               </tr>
            </tbody>
         </Table>
      );
   } else if (isError) {
      content = <div>{error.toString()}</div>;
   }

   const handleLogout = () => {
      dispatch(deleteToken());
      refetch();
      navigate('/login');
   };

   return (
      <section className="container-section">
         <div className="home-div d-flex justify-content-start gap-4 align-items-center flex-column pt-5  ">
            <h2 className="text-primary h1 fw-bold text-uppercase">Welcome</h2>
            {content}
            <Button onClick={handleLogout}>Logout</Button>
         </div>
      </section>
   );
}

export default Home;
