import React from 'react';
import '../styles/savings.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useState} from 'react';
import axios from 'axios';


function ConfirmDelete(props) {
  const {setUpdate, update, show, onHide, userID, catID, catName, c_date} = props;
  // const [showDel, setShowDel] = useState(show);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const handleClose = () => {
    props.onHide(); // Close the modal using the onHide prop from props
  };


  //handle events when a goal is deleted
  const handleDeleteGoal = async () => {

    //delete the goal from the savings table
    const deleteGoal = async () => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/savings/delete/${catID}`);

      if (response.status === 200) {
        setSuccess('Element deleted successfully');
        console.log(success);
      } else {
        setError('Element not found');
        console.log(error);
      }
    } catch (err) {
      setError('Something went wrong! Please try again.');
      console.error(err);
    }}


    //delete any history associated with the deleted goal 
    const deleteGoalHistory = async () => {
    try {
      const safeDate = encodeURIComponent(c_date);
      const response = await axios.delete(`http://localhost:8081/api/savingsHistory/delete/${userID}/${catName}/${safeDate}`);

      if (response.status === 200) {
        setSuccess('Element deleted successfully');
        console.log(success);
      } else {
        setError('Element not found');
        console.log(error);
      }
    } catch (err) {
      setError('Something went wrong! Please try again.');
      console.error(err);
    }}

    //call the delete functions
    deleteGoal();
    deleteGoalHistory();
    setUpdate(!update);
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
