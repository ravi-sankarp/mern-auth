/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable no-else-return */
/* eslint-disable max-len */
import { useState } from 'react';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { MdBorderColor, MdDeleteForever, MdLibraryAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import {
   useAdminDeleteUserMutation,
   useAdminGetUserDataQuery
} from '../../redux/features/api/apiSlice';
import './admin.css';

function AdminHomeLayout() {
   const navigate = useNavigate();
   const [search, setSearch] = useState('');
   const handleSearch = (e) => {
      setSearch(e.target.value.toLowerCase());
   };
   const { data, isLoading, isFetching, isSuccess, isError, error } = useAdminGetUserDataQuery();
   const [adminDeleteUser, { isLoading: isLoadingDelete }] = useAdminDeleteUserMutation();

   const handleDelete = async (id) => {
      if (!isLoadingDelete) {
         try {
            const res = await adminDeleteUser(id).unwrap();
            if (res.status === 'Success') {
               toast.success('Deleted New User', {
                  position: 'bottom-right',
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  closeButton: true
               });
               navigate('/adminhome');
            }
         } catch (err) {
            console.log(err);
            toast.error(`${err.data.message}`, {
               position: 'bottom-right',
               autoClose: 2000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: 'colored',
               closeButton: true
            });
         }
      }
   };
   let content;
   if (isLoading || isFetching) {
      content = (
         <div className="d-flex align-items-center gap-3">
            <Spinner animation="border" role="status" />
            <span className="">Loading...</span>
         </div>
      );
   } else if (isSuccess) {
      content = (
         <Table striped bordered hover>
            <thead>
               <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th />
               </tr>
            </thead>
            <tbody>
               {data.users.map((user, i) => (
                  <tr key={user._id}>
                     <td>{i + 1}</td>
                     <td>{user.firstName}</td>
                     <td>{user.lastName}</td>
                     <td>{user.email}</td>
                     <td>{user.phoneNumber}</td>
                     <td className="text-center">
                        <Link to={`/edituser/${user._id}`}>
                           <Button className=" btn-sm me-2">
                              <MdBorderColor />
                           </Button>
                        </Link>
                        <Button
                           onClick={() => handleDelete(user._id)}
                           className="btn-danger btn-sm mt-sm-2 mt-md-0"
                        >
                           <MdDeleteForever />
                        </Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </Table>
      );
   } else if (isError) {
      content = <p>{error.toString()}</p>;
   }
   let filteredContent;
   if (isSuccess && search) {
      filteredContent = data.users.filter(
         (user) =>
            user.firstName.includes(search) ||
            user.lastName.includes(search) ||
            user.email.includes(search)
      );
      content = (
         <Table striped bordered hover>
            <thead>
               <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th />
               </tr>
            </thead>
            <tbody>
               {filteredContent.map((user, i) => (
                  <tr key={user._id}>
                     <td>{i + 1}</td>
                     <td>{user.firstName}</td>
                     <td>{user.lastName}</td>
                     <td>{user.email}</td>
                     <td>{user.phoneNumber}</td>
                     <td className="text-center">
                        <Link to={`/edituser/${user._id}`}>
                           <Button className=" btn-sm me-2">
                              <MdBorderColor />
                           </Button>
                        </Link>

                        <Button
                           onClick={() => handleDelete(user.id)}
                           className="btn-danger btn-sm mt-sm-2 mt-md-0"
                        >
                           <MdDeleteForever />
                        </Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </Table>
      );
   }

   return (
      <section className="admin-container-section">
         <div className="admin-home-div d-flex justify-content-start gap-4 align-items-center flex-column pt-5  ">
            <Link to="/adminaddnew">
               <Button className="btn-success btn-sm mt-sm-2 mt-md-0">
                  <MdLibraryAdd className="me-2" />
                  Add New User
               </Button>
            </Link>
            <Form className="d-flex">
               <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onKeyUp={handleSearch}
               />
            </Form>
            {content}
         </div>
      </section>
   );
}

export default AdminHomeLayout;
