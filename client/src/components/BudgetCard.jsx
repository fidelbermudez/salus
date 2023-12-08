import React, { useState } from 'react';
import { Card, ProgressBar, Button } from 'react-bootstrap';
import { currencyFormatter } from './utils';
import '../styles/budget.css';
import axios from 'axios';
import { FiX } from 'react-icons/fi';
import ConfirmDeleteCard from './confirmDeleteBudget';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import {MdEdit} from 'react-icons/md';

// function is used to update a budget card, specifically the name of the budget and the limit previously inputted
function NewBudgetForm({ categoryId, name, max, bool, setBool}) {
  // variables in the budget table
  const [budgetName, setBudgetName] = useState(name);
  const [budgetMax, setBudgetMax]  = useState(max);

  // used for doing updates during form submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // handles form submit
  const handleSubmit = async (e) => {
    console.log("new: " + budgetName + "old: " + name);
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // this is used to request for updating a budget entry to the database by doing a PUT request
    const updateBudget = async (e) => {
      try {
        console.log('Updating budget:', categoryId);
        const editedBudget = {limit: budgetMax, category_name: budgetName};
        console.log('Edited budget data:', editedBudget);
        const response = await axios.put(`http://localhost:8081/api/category/update/${categoryId}`, editedBudget);
        console.log('Response from server:', response.data);
        console.log("updated successfully ");

        setIsSubmitting(false);
        setSuccess('Data successfully saved!');
        console.log('Data saved: ', response.data);
        setBool(!bool)
      } catch (err) {
        setIsSubmitting(false);
        setError('Something went wrong! Please try again.');
        console.error(err);
      }
    };
    updateBudget();
  };

  
  return (
   <Form className = "form">
      {/* input for the updated budget name */}
      <Form.Group className="mb-3" controlId="formGoalName">
        <Form.Label>Budget Name</Form.Label>
        <Form.Control className = "input" type="string"
         value={budgetName}
         onChange = {(e) => setBudgetName(e.target.value)}    
        />
      </Form.Group>

      {/* input for the updated budget limit  */}
      <Form.Group className="mb-3" controlId="formGoalAmount" id="edit-goal-amount">
        <Form.Label>Budget Limit</Form.Label>
        <Form.Control  
         value={budgetMax}
         className = "edit-goal"
         onChange = {(e) => setBudgetMax(e.target.value)}
          />
      </Form.Group>

      <div className="add-button-container">
      {/* submit button for updating / editing a budget  */}
      <Button id="add-goal-button" type = "submit" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? 'Updating Budget...' : 'Update Budget'} </Button>
      </div>
    </Form>
  );
}

//  modal for updating budget
function UpdateBudgetModal(props) {
  const { show, onHide,  categoryId, name, max, bool, setBool} = props;
  const handleClose = () => {
    props.onHide(); // used to close the modal using the onHide prop from props
  };


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className = "modal"
    >
    <Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter">
          Edit Budget
        </Modal.Title>
      <CloseButton className="btn-close-white" onClick = {handleClose} style={{ color: 'white !important' }} />
      </Modal.Header>
      <Modal.Body>
        <NewBudgetForm categoryId={categoryId} name= {name} max = {max} bool={props.bool} setBool={props.setBool}  />
      </Modal.Body>
    </Modal>
  );
}

// function used to create and render each individual budget card that appears on the budget page with the option to
// delete them or edit the name and / or limit
export default function BudgetCard({ name, amount, max, grey, categoryId, deletable, customStyle, bool, setBool, bool2 }) {
  // show or close confirm delete modal 
  const [delShow, setDelShow] = useState(false);

  // calculates the ratio of amount to max
  const num = amount / max;
  
  // used to check if num returns NAN in which it sets prog as '0', if it returns a valid number, it calculates the
  //percentage and rounds it to the nearest whole number and appending the percentage sign %
  const prog = isNaN(num) ? '0' : `${Math.round(num * 100)}%`;
  
  // show or close edit modal
  const [modalShow, setModalShow] = React.useState(false);
  
  // used so that the Total Budget card does not render the edit or delete icons
  const isTotalBudget = name === 'Total Budget';

  // used to dynamically generate and return a string of CSS class names depending if amount is greater than max or not
  const cardClassNames = () => {
    const classNames = ['Budgetcard'];
    if (amount > max) {
      classNames.push('bg-red', 'bg-opacity-10');
    } else if (grey) {
      classNames.push('bg-light');
    }
    return classNames.join(' ');
  };


  return (
    <Card className={cardClassNames()} style={name === 'Total Budget' ? customStyle : null}>
      <div className="pointer">
        <div className="placement-button">
        {isTotalBudget ? null : (
        <div className = "edit">
                <Button
                className = "edit-btn"
                variant = "primary" 
                onClick={() => setModalShow(true)}>
                <MdEdit id = "pencil"/>
                </Button>
                <UpdateBudgetModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  categoryId = {categoryId}
                  name = {name}
                  max = {max}
                  bool={bool}
                  setBool={setBool} 
                />
              </div>
              )}
          {deletable && (
            <Button className="trash-icon" onClick={() => setDelShow(true)}>
              <FiX id="xdel" />
            </Button>
          )}
        </div>
      </div>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal">
          <div className="cardName">{name}</div>
        </Card.Title>
        {bool2 && <ProgressBar style={{ height: '25px' }} />}
        {!bool2 && <ProgressBar
          //className="rounded-pill"
          variant={getProgressBarVariant(amount, max)}
          min={0}
          max={max}
          now={amount}
          label={`${prog}`}
          style={{ height: '25px' }}
        />}
        <div className="amount-max">
          {currencyFormatter.format(amount)}
          <span className="fs-6 ms-1">/ {currencyFormatter.format(max)}</span>
        </div>
      </Card.Body>
      <ConfirmDeleteCard show={delShow} onHide={() => setDelShow(false)} categoryId={categoryId} bool={bool} setBool={setBool} />
    </Card>
  );
}

// function gets the percentage of a budget, changes color of the progress bar based on the percentage of completion
function getProgressBarVariant(amount, max) {
  const ratio = amount / max;
  if (ratio < 0.5) return 'primary';
  if (ratio < 0.75) return 'warning';
  return 'danger';
}
