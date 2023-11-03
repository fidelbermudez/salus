import React from 'react';
import '../styles/savings.css'
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import {MdDeleteForever} from 'react-icons/md';
import axios from 'axios';
import {useState, useEffect} from 'react';
// import { currencyFormatter } from "./utils";


function getProgressBarVariant(saved, goal) {
    const ratio = saved / goal
    if (ratio < 1) return "primary"
    return "success"
}

function SavingsCategory({ catId, name, saved, goal, edit}) {
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
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleDeleteElement = async (catId) => {
    console.log(catId, typeof(catId))
    try {
      const response = await axios.delete(`http://localhost:8081/api/savings/delete/${catId}`);

      if (response.status === 200) {
        setSuccess('Element deleted successfully');
      } else {
        setError('Element not found');
      }
    } catch (err) {
      setError('Something went wrong! Please try again.');
      console.error(err);
    }
  };

  
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
              <Button id="delete" onClick={() => handleDeleteElement(catId)}>
                {/* <MdDeleteForever id="trash" /> */}
                X
              </Button>
            ) : null}
          </div>
      </Card.Body>
      
    </Card>

  
  );
}

export default SavingsCategory;
