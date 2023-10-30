import React, { useEffect, useState } from 'react';
import "../styles/transactions.css";
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import { local } from 'd3';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';

function NewExpenseForm() {

  const { currentUser } = useAuth(); 
  const user = localStorage?.userId;
  
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseDay, setExpenseDay]  = useState('');
    const [expenseMonth, setExpenseMonth]  = useState('');
    const [expenseYear, setExpenseYear]  = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription]  = useState('');
  
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
  
    const token = localStorage.getItem('authToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
  
      const formattedDate = `${expenseMonth}/${expenseDay}/${expenseYear}`;

      // post request to add new entry to database
      try {
        const newExpense = {user_id: user, date: formattedDate, amount: expenseAmount, category_name: expenseCategory, description: expenseDescription};
        const response = await axios.post('http://localhost:8081/api/expense/insert', newExpense);

        const newSpending = {user: user, year: expenseYear, month: expenseMonth, category_name: expenseCategory, incrementAmount: expenseAmount};
        const update = await axios.put('http://localhost:8081/api/category/incrementAmount', newSpending);
        
        setIsSubmitting(false);
        setSuccess('Data successfully saved!');
        console.log('Data saved: ', response.data);
        console.log('Data updated: ', update.data);
      } catch (err) {
        setIsSubmitting(false);
        setError('Something went wrong! Please try again.');
        console.error(err);
      }
    };
  
    return (
     <Form className = "form">
        <Form.Group className="mb-3" controlId="formExpenseCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control className = "input" type="string" placeholder='e.g. Category 1'
           value={expenseCategory}
            onChange = {(e) => setExpenseCategory(e.target.value)}
            required/>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formExpenseDay">
          <Form.Label>Day</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 08"
           value={expenseDay}
             onChange = {(e) => setExpenseDay(e.target.value)}
             required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formExpenseMonth">
          <Form.Label>Month</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 05"
           value={expenseMonth}
             onChange = {(e) => setExpenseMonth(e.target.value)}
             required/>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formExpenseYear">
          <Form.Label>Year</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 2021"
           value={expenseYear}
             onChange = {(e) => setExpenseYear(e.target.value)}
             required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formExpenseAmount">
          <Form.Label>Amount</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 5000"
           value={expenseAmount}
             onChange = {(e) => setExpenseAmount(e.target.value)}
             required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formExpenseDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control className = "input" type="string" placeholder='e.g. Netflix subscription'
           value={expenseDescription}
            onChange = {(e) => setExpenseDescription(e.target.value)}
            required/>
        </Form.Group>
  
        {/* submit button  */}
        <Button type = "submit" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? 'Adding Expense...' : 'Add Expense'} </Button>
      </Form>
    );
  }

  //  modal for adding new goal
function NewExpenseModal(props) {
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
          Add an Expense
        </Modal.Title>
      <CloseButton className="btn-close-white" onClick = {handleClose} style={{ color: 'white !important' }} />
      </Modal.Header>
      <Modal.Body>
        <NewExpenseForm/>
      </Modal.Body>
    </Modal>
  );
}

function Transaction() {

  const { currentUser, isLoading: authLoading } = useAuth();  // get isLoading state from AuthContext
  const userId = localStorage?.userId;
  
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [toggle, setToggle] = useState(false);

  // variable for showing or hiding modal
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    if (authLoading) return; // Return early if still determining auth status

    const token = localStorage.getItem('authToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    const fetchIncome = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/income/show/' + userId);
        setIncome(response.data);
      } catch (err) {
        console.error("Error fetching income:", err);
      }
    };

    const fetchExpense = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/expense/show/' + userId);
        setExpense(response.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchIncome();
    fetchExpense();
  }, [userId, authLoading]); // Add authLoading to dependency list

  const handleToggleChange = () => {
    setToggle(!toggle);
  };

  // Only works on Chrome
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.bothTables');
    container.addEventListener('scroll', function() {
      if (container.scrollTop <= 0) {
        // Prevent scrolling above the top
        container.scrollTop = 0;
      } else if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        // Prevent scrolling below the bottom
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }
    });
  });

  const sortIncomeByDate = () => {
    const sortedIncomeByDate = [...income].sort((a, b) => new Date(a.date) - new Date(b.date));
    setIncome(sortedIncomeByDate);
  };

  const sortExpenseByDate = () => {
    const sortedExpenseByDate = [...expense].sort((a, b) => new Date(a.date) - new Date(b.date));
    setExpense(sortedExpenseByDate);
  };

  const sortIncomeByDateDescending = () => {
    const sortedIncomeByDateDescending = [...income].sort((a, b) => new Date(b.date) - new Date(a.date));
    setIncome(sortedIncomeByDateDescending);
  };
  
  const sortExpenseByDateDescending = () => {
    const sortedExpenseByDateDescending = [...expense].sort((a, b) => new Date(b.date) - new Date(a.date));
    setExpense(sortedExpenseByDateDescending);
  };

  const sortIncomeByAmount = () => {
    const sortedIncomeByAmount = [...income].sort((a, b) => a.amount - b.amount);
    setIncome(sortedIncomeByAmount);
  };

  const sortExpenseByAmount = () => {
    const sortedExpenseByAmount = [...expense].sort((a, b) => a.amount - b.amount);
    setExpense(sortedExpenseByAmount);
  };

  const sortIncomeByAmountDescending = () => {
    const sortedIncomeByAmountDescending = [...income].sort((a, b) => b.amount - a.amount);
    setIncome(sortedIncomeByAmountDescending);
  };
  
  const sortExpenseByAmountDescending = () => {
    const sortedExpenseByAmountDescending = [...expense].sort((a, b) => b.amount - a.amount);
    setExpense(sortedExpenseByAmountDescending);
  };

  const sortExpenseByCategory = () => {
    const sortedExpenseByCategory = [...expense].sort((a, b) => a.category_name.localeCompare(b.category_id));
    setExpense(sortedExpenseByCategory);
  };
  
  const sortExpenseByCategoryDescending = () => {
    const sortedExpenseByCategoryDescending = [...expense].sort((a, b) => b.category_name.localeCompare(a.category_id));
    setExpense(sortedExpenseByCategoryDescending);
  };

  return (
    <div>
      <Button variant="primary" className = "button" onClick={() => setModalShow(true)}>
        Add new expense 
      </Button>
      <NewExpenseModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <button className="toggle-button" onClick={handleToggleChange}>
        {toggle ? "Show Expenses" : "Show Income"}
      </button>
      <div className="bothTables">
        {toggle ? (
          <table className = "incomeTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {
              income.map(income => {
                return <tr key={income.id}>
                  <td>{income.date}</td>
                  <td>${income.amount}</td>
                  <td>{income.source}</td>
                </tr>
              })
            }
          </tbody>
        </table>
        ) : (
          <table className="expenseTable">
            <thead>
              <tr>
                <th>Date
                    <button className = "headButton" onClick={sortExpenseByDate}>↑</button>
                    <button className = "headButton" onClick={sortExpenseByDateDescending}>↓</button>
                </th>
                <th>Amount
                    <button className = "headButton" onClick={sortExpenseByAmount}>↑</button>
                    <button className = "headButton" onClick={sortExpenseByAmountDescending}>↓</button>
                </th>
                <th>Category
                    <button className = "headButton" onClick={sortExpenseByCategory}>↑</button>
                    <button className = "headButton" onClick={sortExpenseByCategoryDescending}>↓</button>
                </th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {
                expense.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>${expense.amount}</td>
                    <td>{expense.category_name}</td>
                    <td>{expense.description}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transaction;
