import React from 'react';
import '../styles/savings.css';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import {useState} from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';


function ConfirmDelete(props) {
  const {show, onHide, catID} = props;
  const [showDel, setShowDel] = useState(show);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const handleClose = () => {
    props.onHide(); // Close the modal using the onHide prop from props
  };

  const handleDeleteGoal = async () => {
    console.log("delete element click");
    
    console.log(catID, typeof(catID))

    const deleteGoal = async () => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/savings/delete/${catID}`);

      if (response.status === 200) {
        setSuccess('Element deleted successfully');
      } else {
        setError('Element not found');
      }
    } catch (err) {
      setError('Something went wrong! Please try again.');
      console.error(err);
    }
    }
    deleteGoal();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className = "modalDel"
    >
    {/* <Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter">
          Confirm Delete Goal
        </Modal.Title>
      <CloseButton className="btn-close-white" onClick = {handleClose} style={{ color: 'white !important' }} />
      </Modal.Header> */}
      <Modal.Body className="modalDel-body">
        <p>Are you sure you want to delete this goal?</p>
        <div className = "delButtonGroup">
      <Button onClick= {handleClose}>Cancel</Button>
      <Button id="deletebtn" onClick={handleDeleteGoal}> Delete </Button>
      </div>
      </Modal.Body>
    </Modal>
      

  );
}


export default ConfirmDelete;
