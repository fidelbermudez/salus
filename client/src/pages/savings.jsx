import React from 'react';
import {useState, useEffect} from 'react';
import "../styles/savings.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';
import SavingsCategory from '../components/savingsCat';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 

const user = 3;

function NewGoalForm() {

const { currentUser } = useAuth(); 
const user = currentUser?.userId;

  // variables in the savings table
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount]  = useState('');
  const [amountContributed, setAmountContributed] = useState(0);

  // updates during form submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const token = localStorage.getItem('authToken');
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  
  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // post request to add new entry to database
    try {
      const newGoal = {user_id: user, goal_amount: goalAmount, amount_contributed: amountContributed, savings_category: goalName};
      const response = await axios.post('http://localhost:8081/api/savings/insert', newGoal);
      
      setIsSubmitting(false);
      setSuccess('Data successfully saved!');
      console.log('Data saved: ', response.data);
    } catch (err) {
      setIsSubmitting(false);
      setError('Something went wrong! Please try again.');
      console.error(err);
    }
  };

  return (
   <Form className = "form">
      {/* input for the goal name */}
      <Form.Group className="mb-3" controlId="formGoalName">
        <Form.Label>Goal Name</Form.Label>
        <Form.Control className = "input" type="string" placeholder='e.g. Vacation'
         value={goalName}
          onChange = {(e) => setGoalName(e.target.value)}
          required />
      </Form.Group>

      {/* input for the goal amount  */}
      <Form.Group className="mb-3" controlId="formGoalAmount">
        <Form.Label>Goal Amount</Form.Label>
        <Form.Control type="number" placeholder=" e.g. 2000"
         value={goalAmount}
           onChange = {(e) => setGoalAmount(e.target.value)}
           required/>
      </Form.Group>

      {/* input for how much someone has already contributed to it */}
      <Form.Group className="mb-3" controlId="formAmountContributed">
        <Form.Label>Amount Contributed</Form.Label>
        <Form.Control type="number" placeholder=" e.g. 0"
         value={amountContributed}
           onChange = {(e) => setAmountContributed(e.target.value)}/>
      </Form.Group>

      {/* submit button  */}
      <Button type = "submit" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? 'Adding Goal...' : 'Add Goal'} </Button>
    </Form>
  );
}

//  modal for adding new goal
function NewGoalModal(props) {
  const handleClose = () => {
    props.onHide(); // Close the modal using the onHide prop from props
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className = "modal"
    >
    <Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter">
          Add a New Savings Goal
        </Modal.Title>
      <CloseButton className="btn-close-white" onClick = {handleClose} style={{ color: 'white !important' }} />
      </Modal.Header>
      <Modal.Body>
        <NewGoalForm/>
      </Modal.Body>
    </Modal>
  );
}

// main function in the page, in charge of display and combining all features
function Savings() {
  // variable for showing or hiding modal
  const [modalShow, setModalShow] = React.useState(false);
  // variable for all goals belonging to user
  const [goals, setGoals] = React.useState([]);

  // get requests to get all of the savings goals for a user
  useEffect(() => {
    axios.get('http://localhost:8081/api/savings/show/' + user)
    .then(goals => setGoals(goals.data))
    .catch(err => console.log(err))
  })
  
  return (
    <div className="Saving">
      <h1> Savings </h1>

      {/* box displaying total savings across all accounts */}
      {/* <div className="total-savings"> 
        <h3>Total Savings </h3>
      </div> */}

      <div className = "add">
      {/* button that allows user to add a new savings goal */}
      <Button variant="primary" className = "button" onClick={() => setModalShow(true)}>
        Add new goal 
      </Button>
      {/* modal for adding new goal */}
      <NewGoalModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      </div>

      
      {/* display of existing savings goals and goal progress */}
      <div className = "goals"> 
        <h3>Your Saving Goals </h3>
      </div>

      {/* map over all goals and create individual displays */}
      <div className = 'show-categories'>
      {
      goals.map(goal =>{
        return (
        <div className = "goaldiv"> 
        <SavingsCategory name={goal.savings_category} saved={goal.amount_contributed} goal={goal.goal_amount} /> 
        </div>);
      })}
      </div>

    </div>
  );
}

export default Savings;

