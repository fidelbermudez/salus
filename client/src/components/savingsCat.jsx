import React from 'react';
import '../styles/savings.css'
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import {MdEdit} from 'react-icons/md';
import {FiX} from 'react-icons/fi'
import axios from 'axios';
import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import SavingsHist from './savingsHist';
import ConfirmDelete from './confirmDelete';
// import { currencyFormatter } from "./utils";

function NewGoalForm({ setUpdate, update, userID, catId, name, saved, goal, c_date}) {
  // variables in the savings table
  const [goalName, setGoalName] = useState(name);

  const [goalAmount, setGoalAmount]  = useState(goal);

  const [amountUpdate, setAmountUpdate]  = useState(0);
  const [amountContributed, setAmountContributed] = useState(saved);
  const [pos, setPos] = useState(true);


  // updates during form submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  // handle form submit
  const handleSubmit = async (e) => {
    console.log("new: " + goalName + "old: " + name);
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const newSaved = parseFloat(amountContributed) + (pos ? parseFloat(amountUpdate) : -parseFloat(amountUpdate));
    

    const updateGoal = async (e) => {
    // request to update entry to database
      const hasCompleted = (goalAmount - newSaved <= 0);
      console.log("has completed the goal? ", hasCompleted)
      let completed = 0;
      if(hasCompleted){
        completed = 1;
      } else {
        completed = 0;
      }

      try {
        const editedGoal = {goal_amount: goalAmount, amount_contributed: newSaved, savings_category: goalName, completed: completed};
        const response = await axios.put(`http://localhost:8081/api/savings/update/${catId}`, editedGoal);
        console.log(response);
        console.log("updated successfully ");

        setIsSubmitting(false);
        setSuccess('Data successfully saved!');
        console.log('Data saved: ', response.data);
        console.log(success)
      } catch (err) {
        setIsSubmitting(false);
        setError('Something went wrong! Please try again.');
        console.log(error);
        console.error(err);
      }
    };

    const addToHist = async (e) => {
    // request to add entry to database
    const date = new Date();
    const formattedDateTime = date.toLocaleDateString('en-US');
    console.log(date);

    const showTime = date.getHours() 
        + ':' + date.getMinutes() 
        + ":" + date.getSeconds();


    let amount = parseFloat(amountUpdate);
    if(!pos){
      amount = -amount;
    }
      try {
        const newEntry = {user_id: userID, date: formattedDateTime, timestamp:showTime, amount: amount, 
                          savings_category: goalName, creation_date: c_date};
        const response = await axios.post(`http://localhost:8081/api/savingsHistory/insert`, newEntry);
        console.log(response);
        console.log("posted successfully ");

        setIsSubmitting(false);
        setSuccess('Data successfully saved!');
        console.log('Data saved: ', response.data);
      } catch (err) {
        setIsSubmitting(false);
        setError('Something went wrong! Please try again.');
        console.error(err);
      }
    };

    const editHistName = async(e) => {
      // const safeDate = encodeURIComponent(c_date);
  
      try{
        const updateEntry = {user_id: userID, new_name: goalName, creation_date: c_date};
        const response = await axios.put(`http://localhost:8081/api/savingsHistory/update/${name}`, updateEntry);
        console.log("posted successfully ");

        setIsSubmitting(false);
        setSuccess('Data successfully saved!');
        console.log('Data saved: ', response.data);
      } catch (err) {
        setIsSubmitting(false);
        setError('Something went wrong! Please try again.');
        console.error(err);
      }
    }

    updateGoal();
    if(amountUpdate !== 0){
      addToHist();
    };
    if(goalName !== name){
      editHistName();
    }

    setAmountContributed(newSaved);

    //clear value fields after submit
    setAmountUpdate(0);
    setUpdate(!update);
  };

  // Function to set 'pos' to true; will be used to add or subtract from amount
  const setPosToTrue = () => {
    setPos(true);
  };

  // Function to set 'pos' to false
  const setPosToFalse = () => {
    setPos(false);
  };


  const calculateTotal = () => {
    const amount = parseFloat(amountContributed) + (pos ? parseFloat(amountUpdate) : -parseFloat(amountUpdate));
    if (amount < 0) {
      return 0;
    }
    return amount;
  }
  
  return (
   <Form className = "form">
      {/* input for the goal name */}
      <Form.Group className="mb-3" controlId="formGoalName">
        <Form.Label>Goal Name</Form.Label>
        <Form.Control className = "input" type="string"
         value={goalName}
         onChange = {(e) => setGoalName(e.target.value)}    
        />
      </Form.Group>

      {/* input for the goal amount  */}
      <Form.Group className="mb-3" controlId="formGoalAmount" id="edit-goal-amount">
        <Form.Label>Goal Amount</Form.Label>
        <Form.Control  
         value={goalAmount}
         className = "edit-goal"
         onChange = {(e) => setGoalAmount(e.target.value)}
          />
      </Form.Group>

      {/* input for how much someone has already contributed to it */}
      <Form.Group className="mb-3" controlId="formAmountContributed" id="add-goal-text">
        <Form.Label>Amount Contributed</Form.Label>
        <Form.Control  
         value={amountContributed}
         className = "edit-curramount"
         readOnly
          />
        <ToggleButtonGroup type="radio" defaultValue={1} name="options" className="add-or-sub">
          <ToggleButton id="addmoney" value={1} onClick={setPosToTrue}>
            +
          </ToggleButton>
          <ToggleButton id="submoney" value={2} onClick={setPosToFalse}>
            -
          </ToggleButton>
        </ToggleButtonGroup>
        <Form.Control type="number" 
         value={amountUpdate}
         onChange = {(e) => setAmountUpdate(e.target.value)}
         className = "edit-addamount"
          />
        <div id ="equals">  
           = 
        </div>   
        <Form.Control
         value={calculateTotal()}
         className = "edit-totalamount"
         readOnly
          />
      </Form.Group>

      <div className="add-button-container">
      {/* submit button  */}
      <Button id="add-goal-button" type = "submit" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? 'Updating Goal...' : 'Update Goal'} </Button>
      </div>
    </Form>
  );
}

//  modal for updating goal
function UpdateGoalModal(props) {
  const { setUpdate, update, show, onHide, userID,  catID, name, saved, goal, date } = props;
  const handleClose = () => {
    props.onHide(); // Close the modal using the onHide prop from props
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
          Edit Goal
        </Modal.Title>
      <CloseButton className="btn-close-white" onClick = {handleClose} style={{ color: 'white !important' }} />
      </Modal.Header>
      <Modal.Body>
        <NewGoalForm setUpdate={setUpdate} update={update} userID= {userID} catId={catID} name= {name} saved={saved} goal={goal} c_date={date} />
      </Modal.Body>
    </Modal>
  );
}


function getProgressBarVariant(saved, goal) {
    const ratio = saved / goal
    if (ratio < 1) return "primary"
    return "success"
}

function SavingsCategory({ setUpdate, update, userID, catId, name, saved, goal, date}) {
  // format currency 
  const currencyFormatter = new Intl.NumberFormat(undefined, {
    currency: "usd",
    style: "currency",
    minimumFractionDigits: 0,
  })

  // visual changes when you have exceeded your goal
  const classNames = []
  if (saved > goal) {
        classNames.push("bg-danger", "bg-opacity-10")
  }
  
  // calculate percentage contributed toward goal
  const num = saved/goal;
  const prog = Math.round(num * 100);


  // show or close edit modal
  const [modalShow, setModalShow] = React.useState(false);
  // show or close savings history modal
  const [histShow, setHistShow] = React.useState(false);
  // show or close confirm delete modal 
  const[delShow, setDelShow] = React.useState(false);
  
  return (
    <Card style={{ width: '500rem' }}  className ="card">
        <div className="card-buttons">
              <div className = "edit">
                <Button
                className = "edit-btn"
                variant = "primary" 
                onClick={() => setModalShow(true)}>
                <MdEdit id = "pencil"/>
                </Button>
                <UpdateGoalModal
                  setUpdate = {setUpdate}
                  update = {update}
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  userID = {userID}
                  catID = {catId}
                  name = {name}
                  saved = {saved}
                  goal = {goal}
                  date = {date}
                />
              </div>
              <div className="removeCat">
                <Button className="delete" onClick={() => setDelShow(true)}>
                  <FiX id="xdel"/>
                </Button>

              </div>
            </div>
      <button className="btnastext" onClick={() => setHistShow(true)}>
      <Card.Body>
        <Card.Title className="title">
          <div className="catName">
           {name}
          </div>
          <div className="catDate">
          <p> Started on: {date} </p>
          </div>
        </Card.Title>
        <ProgressBar 
          className="prog-bar-save" 
          variant={getProgressBarVariant(saved, goal)}
          min={0}
          max={goal}
          now={saved}
          label={`${prog}%`}
          style= {{height: "25px"}}
          />
          <div className="goalAmount">
                {currencyFormatter.format(saved)}
                <span className="totalGoal">
                  / {currencyFormatter.format(goal)}
                </span>
          </div>
      </Card.Body>

    </button>
    <SavingsHist 
      show={histShow}
      onHide={() => setHistShow(false)}
      catID = {catId}
      name = {name}
      userID = {userID}
      creation_date = {date}/>

    <ConfirmDelete       
      setUpdate={setUpdate}
      update={update}
      show={delShow}
      onHide={() => setDelShow(false)}
      userID = {userID}
      catID = {catId}
      catName = {name}
      c_date = {date} >
    </ConfirmDelete>

    </Card>

  
  );
}

export default SavingsCategory;
