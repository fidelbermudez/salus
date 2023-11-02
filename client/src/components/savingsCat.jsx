import React from 'react';
import '../styles/savings.css'
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import {MdDeleteForever} from 'react-icons/md';
import axios from 'axios';
// import { currencyFormatter } from "./utils";


function getProgressBarVariant(saved, goal) {
    const ratio = saved / goal
    if (ratio < 1) return "primary"
    return "success"
}

function SavingsCategory({ id, name, saved, goal, edit}) {
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

  // function for deleting a category
  const deleteCat = async (e) => {
    console.log(id)

    try {
      const response = await axios.delete(`http://localhost:8081/api/savings/delete/${id}`);
      
      console.log("testing")
      // Check the response to see if the delete was successful
      if (response.status === 200) {
        console.log('Element deleted:', id);
      } else {
        console.error('Failed to delete element:', id);
      }
    } catch (err) {
      console.error('Error deleting element:', err);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setError(null);
  //   setSuccess(null);

  //   // post request to add new entry to database
  //   try {
  //     const newGoal = {user_id: userId, goal_amount: goalAmount, amount_contributed: amountContributed, savings_category: goalName};
  //     const response = await axios.post('http://localhost:8081/api/savings/insert', newGoal);
      
  //     setIsSubmitting(false);
  //     setSuccess('Data successfully saved!');
  //     console.log('Data saved: ', response.data);
  //   } catch (err) {
  //     setIsSubmitting(false);
  //     setError('Something went wrong! Please try again.');
  //     console.error(err);
  //   }
  // };
  
  return (
    <Card style={{ width: '500rem' }}  className ="card">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between 
            align-items-baseline fw-normal">
            <div className="me-2">{name}:</div>
              <div className="d-flex align-items-baseline">
                {currencyFormatter.format(saved)}
                <span className="text-muted fs-6 ms-1">
                 / {currencyFormatter.format(goal)}
                </span>
              </div>
        </Card.Title>
        <ProgressBar 
          className="prog-bar-sav" 
          variant={getProgressBarVariant(saved, goal)}
          min={0}
          max={goal}
          now={saved}
          label={`${prog}%`}
          />
          <div className="temp">
            {edit ? (
              <Button id="delete">
                <MdDeleteForever id="trash" onClick={deleteCat} />
              </Button>
            ) : null}
          </div>
      </Card.Body>
      
    </Card>

  
  );
}

export default SavingsCategory;
