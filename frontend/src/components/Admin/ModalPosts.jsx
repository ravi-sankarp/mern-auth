/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-trailing-spaces */

import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAdminDeleteUserMutation } from '../../redux/features/api/apiSlice';

function ModalPosts({ setOpen, open, id, name }) {
   const [adminDeleteUser, { isLoading: isLoadingDelete }] = useAdminDeleteUserMutation();

   const navigate = useNavigate();
   const handleDelete = async () => {
      if (!isLoadingDelete) {
         try {
            setOpen(false);
            const res = await adminDeleteUser(id).unwrap();
            if (res.status === 'success') {
               toast.success('Deleted User', {
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
   return (
      <Modal show={open} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
         <Modal.Header closeButton onClick={() => setOpen(false)} />
         <>
            <Modal.Body className="d-flex flex-column">
               <p className="fw-bold">
                  Are you sure you want to delete<p className="h4 mt-3 text-danger">{name}</p>
               </p>
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => setOpen(false)}>Cancel</Button>
               <Button variant="danger" onClick={() => handleDelete()}>
                  Yes
               </Button>
            </Modal.Footer>
         </>
      </Modal>
   );
}

export default ModalPosts;
