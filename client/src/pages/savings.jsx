import React from 'react';
import "../styles/savings.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
// import CloseButton from 'react-bootstrap/CloseButton';


function NewGoalForm() {
  return (
   <Form>
      <Form.Group className="mb-3" controlId="formGoalName">
        <Form.Label>Goal Name</Form.Label>
        <Form.Control type="goal-name" placeholder='e.g. Vacation' />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGoalAmount">
        <Form.Label>Goal Amount</Form.Label>
        <Form.Control type="goal-amount" placeholder=" e.g. 2000" />
      </Form.Group>
    </Form>
  );
}

function NewGoalModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
    <Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter">
          Add a New Savings Goal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NewGoalForm/>
        <Button onClick={props.onHide}>Add Goal</Button>
      </Modal.Body>
    </Modal>
  );
}


function Savings() {
  const [modalShow, setModalShow] = React.useState(false);
  
  return (
    <div className="Saving">
      <h1> Savings </h1>

      {/* box displaying total savings across all accounts */}
      <div className="total-savings"> 
        <h3>Total Savings </h3>
      </div>

      <div className = "add">
      {/* button that allows user to add a new savings goal */}
      <Button variant="primary" className = "button" onClick={() => setModalShow(true)}>
        Add new goal 
      </Button>

      <NewGoalModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      </div>

      
      {/* display of existing savings goals and goal progress */}
      <div className = "goals"> 
        <h3>Your Saving Goals </h3>
      </div>

    </div>
  );
}

export default Savings;


