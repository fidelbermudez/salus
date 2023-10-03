import React from 'react';
import {useState, useEffect} from 'react';
import "../styles/savings.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';
import SavingsCategory from '../components/savingsCat';


function NewGoalForm() {
  // to do: form control so that goal name is a string and goal amount is a number
  // add loading state button 
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount]  = useState('');

  //handle submission of form and create a post request
   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
        if (response.status === 200) {
            const userData = await response.json();
            setCurrentUser(userData); 
            console.log("User Data after Login:", userData);
            navigate("/user");
      } else {
            const data = await response.json();
            alert(data.message);
      }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
    }
  };


    // fetch('http://localhost:8081/api/savings/create', {
    //   method: 'POST',
    //   headers: { "Content-Type": "application/json"},
    //   body: JSON.stringify(goal)
    // }).then(() => {
    //   console.log("new goal added")
    // })
  }
  
  return (
   <Form>
      <Form.Group className="mb-3" controlId="formGoalName">
        <Form.Label>Goal Name</Form.Label>
        <Form.Control type="goal-name" placeholder='e.g. Vacation'
         value = {goalName} onChange = {(e) => setGoalName(e.target.value)}/>
      </Form.Group>
      

      <Form.Group className="mb-3" controlId="formGoalAmount">
        <Form.Label>Goal Amount</Form.Label>
        <Form.Control type="goal-amount" placeholder=" e.g. 2000"
         value = {goalAmount} onChange = {(e) => setGoalAmount(e.target.value)} />
      </Form.Group>

      <Button onClick={handleSubmit}>Add Goal</Button>
    </Form>
  );
}

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


function Savings() {
  const [modalShow, setModalShow] = React.useState(false);
  const [goals, setGoals] = React.useState(null);
  //to do: create a fetch request for the user information so we can display info ab categories
  // involves implementing props into the components so it is more customizable

  // 'http://localhost:8081/api/savings/show/3'

  useEffect(() => {
    fetch('http://localhost:8081/api/savings/show/3'
    ).then(res => {
      return res.json();
    })
    .then((data => {
      console.log(data);
      setGoals()
    }))
  })

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

      <div className = 'show-categories'>
      <SavingsCategory />
      </div>

    </div>
  );
}

export default Savings;

// const handleSubmit = (e) => {
//     // e.preventDefault();
//     const goal = { goalName, goalAmount };
//     console.log(goal);
//   }


//code kelvin is providing... 
// import React, { useState } from 'react';
// import axios from 'axios';

// const SavingsForm = () => {
//   const [formData, setFormData] = useState({
//     user_id: '',
//     goal_amount: '',
//     amount_contributed: '',
//     savings_category: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // Adjust the endpoint according to your server setup
//       const response = await axios.post('http://localhost:8081/api/savings/insert', formData);
      
//       setIsSubmitting(false);
//       setSuccess('Data successfully saved!');
//       console.log('Data saved: ', response.data);
//     } catch (err) {
//       setIsSubmitting(false);
//       setError('Something went wrong! Please try again.');
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h1>Savings Entry</h1>
//       {error && <p style={{color: 'red'}}>{error}</p>}
//       {success && <p style={{color: 'green'}}>{success}</p>}
      
//       <div>
//         <label htmlFor="goal_amount">Goal Amount:</label>
//         <input 
//           type="number" 
//           id="goal_amount" 
//           name="goal_amount" 
//           value={formData.goal_amount}
//           onChange={handleInputChange} 
//           required
//         />
//       </div>
      
//       <div>
//         <label htmlFor="amount_contributed">Amount Contributed:</label>
//         <input 
//           type="number" 
//           id="amount_contributed" 
//           name="amount_contributed" 
//           value={formData.amount_contributed}
//           onChange={handleInputChange} 
//           required
//         />
//       </div>
      
//       <div>
//         <label htmlFor="savings_category">Savings Category:</label>
//         <input 
//           type="text" 
//           id="savings_category" 
//           name="savings_category" 
//           value={formData.savings_category}
//           onChange={handleInputChange} 
//           required
//         />
//       </div>
      
//       <button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? 'Submitting...' : 'Submit'}
//       </button>
//     </form>
//   );
// };

// export default SavingsForm;
