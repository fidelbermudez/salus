import React from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from "react";
import axios from 'axios'
import '../styles/budget.css';
import BudgetCard from '../components/BudgetCard';
import { useAuth } from '../AuthContext';
import PieChart from '../components/pieChartBudget';
import Summary from './summary';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import { AiOutlinePlus } from 'react-icons/ai';
 
// function is used to show the reusable form that is used for adding a new budget entry
function NewBudgetForm({bool, setBool}) {
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
    // document layout for new document and post request to add new entry to database
    const addBudget = async (e) => {
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

      // clear input fields after successful submission
      setBudgetName('');
      setBudgetMax('');
      setMonth('');
      setYear('');

      setBool(!bool)
    } catch (err) {
      setIsSubmitting(false);
      setError('Something went wrong! Please try again.');
      console.error(err);
    }};
    addBudget();
  };
  
  return (
    <Form className = "form">
      {/* Input new budget name */}
      <Form.Group className="mb-3" controlId="formBudgetName">
        <Form.Label>Budget Name</Form.Label>
        <Form.Control className = "input" type="string" placeholder='e.g. Entertainment'
          value={budgetName}
          onChange = {(e) => setBudgetName(e.target.value)}
          required />
      </Form.Group>

      {/* Input new budget maximum / limit */}
      <Form.Group className="mb-3" controlId="formBudgetMax">
        <Form.Label>Budget Maximum</Form.Label>
        <Form.Control type="number" placeholder=" e.g. 1000"
          value={budgetMax}
            onChange = {(e) => setBudgetMax(e.target.value)}
            required/>
      </Form.Group>

      {/* Input new budget's month */}
      <Form.Group className="mb-3" controlId="formMonth">
        <Form.Label>Month</Form.Label>
        <Form.Control type="number" placeholder=" e.g. 01"
          value={getMonth}
            onChange = {(e) => setMonth(e.target.value)}
            required/>
      </Form.Group>

      {/* Input new budget's year */}
      <Form.Group className="mb-3" controlId="formYear">
        <Form.Label>Year</Form.Label>
        <Form.Control type="number" placeholder=" e.g. 2023"
          value={getYear}
            onChange = {(e) => setYear(e.target.value)}
            required/>
      </Form.Group>

      {/* submit button for adding a new budget */}
      <Button 
        type = "submit" 
        onClick={handleSubmit} 
        disabled={isSubmitting}> {isSubmitting ? 'Adding Budget...' : 'Add Budget'} 
      </Button>
    </Form>
  );
}
 
// modal function for adding a new budget
function NewBudgetModal(props) {
  console.log(props)
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
          <NewBudgetForm bool={props.bool} setBool={props.setBool}/>
        </Modal.Body>
      </Modal>
    );
  }
 
// Main Function for budget page
//
function Budget() {
  // show/hide modal
  const [modalShow, setModalShow] = React.useState(false);
  // show or close edit modal 
  const [editShow, setEditShow] = React.useState(false);
  const userId = localStorage?.userId;
  //variables for budget function
  const [expenses, setExpenses] = useState(0);
  const [limit, setLimit] = useState(0);
  const [categoryInfo, setCategoryInfo] = useState([]);
  // define and initialize budgets state
  const [budgets, setBudgets] = useState([]);
  // used to show the current month and year to filter budget cards based on that, also used for graphs, and helps to render instantly
  const [currYear, setCurrYear] = useState(new Date().getFullYear());
  const [currMonth, setCurrMonth] = useState(new Date().getMonth() + 1);
  const [bool, setBool] = useState(false);
  const [bool2, setBool2] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)
  const [totalBudget, setTotalBudget] = useState(0)

  // function takes monthNumber, which is a number representing a month, convert it to the month name and 
  // return to show on client page
  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  // fetch budgets with category information based on the user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/category/user/${userId}/${currYear}/${currMonth}`);
        const budgetData = response.data;
        setBudgets(budgetData);
        setTotalBudget(budgetData.reduce((total, budget) => total + parseInt(budget.limit || 0), 0));
        setTotalSpent(budgetData.reduce((total, budget) => total + parseInt(budget.amount_spent || 0), 0));
        setBool2(false)
      } catch (e) {
        if (e.response && e.response.status === 404) {
          setBudgets([]);
          setTotalSpent(0);
          setTotalBudget(0);
          setBool2(true)
        } else {
          console.error(e);
        }
      }
    };
    fetchData();
  }, [userId, currMonth, currYear, bool]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currMonth != null) {
          const categoryResponse = await axios.get(`http://localhost:8081/api/category/user/${userId}/${currYear}/${currMonth}`);
          const fetchedCategoryInfo = categoryResponse.data;  
          // calculate total expenses and limits for total budget card
          let totalExpenses = 0;
          let totalLimit = 0;
  
          fetchedCategoryInfo.forEach(expense => {
            totalExpenses += (expense.amount_spent || 0);
            totalLimit += (expense.limit || 0);
          });
  
          // ppdate the state after calculating totals
          setCategoryInfo(fetchedCategoryInfo);
          setExpenses(totalExpenses);
          setLimit(totalLimit);
        }
      } catch (e) {
        if (e.response && e.response.status === 404) {
          setCategoryInfo([]);
          setLimit(0)
          setExpenses(0)
        } else {
          console.error(e);
        }
      }
    };
    fetchData();
  }, [userId, currMonth, currYear, bool]);

  // const is used to handle changes to the current month in the budget page, also makes sure to to clear for duplicates
  const handleMonthChange = (change) => {
    const newMonth = currMonth + change;
    if (newMonth >= 1 && newMonth <= 12) {
      setCurrMonth(newMonth);
    } else if (newMonth === 0) {
      setCurrMonth(12);
      setCurrYear(currYear - 1);
    } else if (newMonth === 13) {
      setCurrMonth(1);
      setCurrYear(currYear + 1);
    }
  };

 // this allows for the total budget card to change the min-width to be different from the other budget cards
 const [totalBudgetCardStyle, setTotalBudgetCardStyle] = useState({
  minWidth: "60%", // Set your desired minWidth here
  margin: "0 auto", // Center the card
});


  return (
    <>
    <div style={{display: 'flex'}} >
    <div className="everything1">
    <Container className="my4">
    <div className="month-container">
      {/* previous and Next Month Buttons */}
        <div className="month-buttons">
          <Button variant='primary' onClick={() => handleMonthChange(-1)}>Prev</Button>
          <h1>{getMonthName(currMonth)} {currYear}</h1>
          <Button variant='primary'onClick={() => handleMonthChange(1)}>Next</Button>
        </div>
    </div>

    {/* new budget card for total budget and amount spent */}
    <div className="total-budget-card">
      <BudgetCard
        name="Total Budget"
        amount={totalSpent}
        max={totalBudget}
        bool2={bool2}
        grey={true}
        customStyle={totalBudgetCardStyle}
      />
    </div>
    
      <Stack direction="horizontal" gap="2" className="mb-3">
      <h2 className="me-auto"> Your Budgets </h2>
      {/* Plus icon to add new budget and make it show up when clicked */}
      <div class="pointer">
      <AiOutlinePlus style={{ fontSize: '2rem', color: 'white' }} onClick={() => setModalShow(true)}/>
      </div>
      <NewBudgetModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setBool={setBool}
        bool={bool}
      />
      </Stack>

      <hr />
        
      {/* this is making all the budgets appear on the screen right now*/}
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
            bool={bool}
            setBool={setBool}
          ></BudgetCard>
        </div>
      ))}
    </div>
    </Container>
    </div>
    <div className="everything1" style={{background: "white"}}>
      <PieChart data={categoryInfo} active={true} limit={limit} expenses={expenses}/>
      <Summary key={`${currYear}-${bool}`} yr={currYear} setCurrYear={setCurrYear} setCurrMonth={setCurrMonth}/>
    </div>
    </div>
  </>
  );
}

export default Budget;
