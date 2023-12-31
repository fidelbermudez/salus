import React from 'react';
import '../styles/budget.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useState} from 'react';
import axios from 'axios';

// function is responsible for showing the window asking if a user wants to delete a budget card
function ConfirmDeleteCard(props) {
  const {show, onHide, categoryId, bool, setBool} = props;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleClose = () => {
    props.onHide(); // Close the modal using the onHide prop from props
  };

  const handleDeleteBudget = async () => {
    console.log("delete element click");
    console.log(categoryId, typeof(categoryId))

    const deleteBudget = async () => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/category/delete/${categoryId}`);

      if (response.status === 200) {
        setSuccess('Element deleted successfully');
        setBool(!bool)
      } else {
        setError('Element not found');
      }
    } catch (err) {
      setError('Something went wrong! Please try again.');
      console.error(err);
    }
    }
    deleteBudget();
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
        <p>Are you sure you want to delete this budget?</p>
        <div className = "delButtonGroup">
      <Button onClick= {handleClose}>Cancel</Button>
      <Button id="deletebtn" onClick={handleDeleteBudget}> Delete </Button>
      </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmDeleteCard;
