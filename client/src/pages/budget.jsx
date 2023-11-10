import React from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from "react";
import axios from 'axios'
import '../styles/budget.css';
import BudgetCard from '../components/BudgetCard';
import AddBudgetModal from '../components/AddBudgetModal';
import { useAuth } from '../AuthContext';
 
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import { AiOutlinePlus } from 'react-icons/ai';
 
function NewBudgetForm() {
 
  const { currentUser } = useAuth();
  const user = localStorage?.userId;
  
    // variables in budget table
    const [budgetName, setBudgetName] = useState('');
    const [budgetMax, setBudgetMax]  = useState('');
    const [getMonth, setMonth] = useState('');
    const [getYear, setYear] = useState('');
  
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
  
      // document layout for new doc and post request to add new entry to database
      try {
        const newBudget = {
          month: getMonth,
          year: getYear,
          category_name: budgetName,
          user: user,
          amount_spent: 0,
          limit: budgetMax
        };
        const response = await axios.post('http://localhost:8081/api/category/insert', newBudget);
        
        setIsSubmitting(false);
        setSuccess('Data successfully saved!');
        console.log('Data saved: ', response.data);
        window.location.reload();
      } catch (err) {
        setIsSubmitting(false);
        setError('Something went wrong! Please try again.');
        console.error(err);
      }
    };
  
    return (
     <Form className = "form">
        {/* INPUT BUDGET NAME */}
        <Form.Group className="mb-3" controlId="formBudgetName">
          <Form.Label>Budget Name</Form.Label>
          <Form.Control className = "input" type="string" placeholder='e.g. Entertainment'
           value={budgetName}
            onChange = {(e) => setBudgetName(e.target.value)}
            required />
        </Form.Group>
  
        {/* INPUT BUDGET MAXIMUM */}
        <Form.Group className="mb-3" controlId="formBudgetMax">
          <Form.Label>Budget Maximum</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 1000"
           value={budgetMax}
             onChange = {(e) => setBudgetMax(e.target.value)}
             required/>
        </Form.Group>
 
        {/* INPUT BUDGET MONTH */}
        <Form.Group className="mb-3" controlId="formMonth">
          <Form.Label>Month</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 01"
           value={getMonth}
             onChange = {(e) => setMonth(e.target.value)}
             required/>
        </Form.Group>
 
        {/* INPUT BUDGET YEAR */}
        <Form.Group className="mb-3" controlId="formYear">
          <Form.Label>Year</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 2023"
           value={getYear}
             onChange = {(e) => setYear(e.target.value)}
             required/>
        </Form.Group>
      
        <Button type = "submit" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? 'Adding Budget...' : 'Add Budget'} </Button>
      </Form>
    );
  }
 
//Modal function for adding a new budget
function NewBudgetModal(props) {
  const handleClose = () => {
    props.onHide();
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
            Add a New Budget
          </Modal.Title>
        <CloseButton className="btn-close-white" onClick = {handleClose} style={{ color: 'white !important' }} />
        </Modal.Header>
        <Modal.Body>
          <NewBudgetForm/>
        </Modal.Body>
      </Modal>
    );
  }
 
/////MAIN FUNCTION FOR BUDGET PAGE
////
///
function Budget() {
  // const to show/hide modal
  const [modalShow, setModalShow] = React.useState(false);
 
  //show
  const [editShow, setEditShow] = React.useState(false);
 
  const userId = localStorage?.userId;
 
  const [budgets, setBudgets] = useState([]); // Define and initialize budgets state
 
  useEffect(() => {
    // Fetch budgets with category information based on the user
    //Note this happened after I changed api/budgets into api/category down below
    axios.get(`http://localhost:8081/api/category/user/${userId}`)
      .then(response => {
        setBudgets(response.data);
      })
      .catch(error => {
        console.error('Error fetching budgets:', error);
      });
  }, [userId]);
 
 
  return (
    <>
    <div className="everything">
    <Container className="my-4">
      <Stack direction="horizontal" gap="2" className="mb-4">
      <h1 className="me-auto"> Your Budgets </h1>
      
      {/* Plus icon to add new budget and make it show up when clicked */}
      <div class="pointer">
      <AiOutlinePlus style={{ fontSize: '2rem' }} onClick={() => setModalShow(true)}/>
      </div>
      <NewBudgetModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      </Stack>
 
      {/* Div with <BudgetCard is hardcoded example of how budgets should look like>*/}
      {/* <div style={{
        display:"grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1rem",
        alignItems: "flex-start",
        }}
      > */}
      
      {/* This is also the hardcoded version example
        <BudgetCard name="Entertainment" amount={200} max={1000}></BudgetCard>
        <BudgetCard name="Food" amount={600} max={1000}></BudgetCard>
        <BudgetCard name="leisure" amount={900} max={1000}></BudgetCard> */}
 
        
        {/* this is making all the budgets appear on the screen right now*/}
        <div className="everything2">
        <div className="grid-container">
        {budgets.map((budget) => (
          <div className="budget-card" key={budget._id}>
            <BudgetCard
              name={budget.category_name}
              amount={budget.amount_spent}
              max={budget.limit}
              edit={editShow}
              categoryId={budget._id}
              deletable={true}
            ></BudgetCard>
          </div>
        ))}
      </div>
      </div>
    </Container>
    </div>
  </>
  );

}

 
export default Budget;