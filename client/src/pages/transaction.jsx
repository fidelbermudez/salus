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

function NewExpenseForm({ onSubmit }) {

  const { currentUser } = useAuth(); 
  const user = localStorage?.userId;
  
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseDay, setExpenseDay] = useState('');
    const [expenseMonth, setExpenseMonth] = useState('');
    const [expenseYear, setExpenseYear] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
  
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

      if (
        !expenseCategory ||
        !expenseDay ||
        !expenseMonth ||
        !expenseYear ||
        !expenseAmount ||
        !expenseDescription
      ) {
        setIsSubmitting(false);
        return;
      }
  
      const formattedDate = `${expenseMonth}/${expenseDay}/${expenseYear}`;

      // post request to add new entry to database
      try {
        const recentExpense = await axios.get('http://localhost:8081/api/expense/latest');
        const mostRecentExpenseId = recentExpense.data.expense_id;
        const newExpenseId = mostRecentExpenseId + 1;

        const newExpense = {expense_id: newExpenseId, 
                            user_id: user, 
                            bank_id: user, 
                            date: formattedDate, 
                            amount: expenseAmount, 
                            description: expenseDescription,
                            category_name: expenseCategory};
        const response = await axios.post('http://localhost:8081/api/expense/insert', newExpense);

        const newSpending = {user: user, 
                            year: expenseYear, 
                            month: expenseMonth, 
                            category_name: expenseCategory, 
                            incrementAmount: expenseAmount};
        const update = await axios.put('http://localhost:8081/api/category/incrementAmount', newSpending);
        
        setIsSubmitting(false);
        setSuccess('Data successfully saved!');
        console.log('Recent Expense ID: ', newExpenseId);
        console.log('Data saved: ', response.data);
        console.log('Data updated: ', update.data);
        onSubmit();
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
  const handleFormSubmit = () => {
    handleClose();
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
        <NewExpenseForm onSubmit={handleFormSubmit} />
      </Modal.Body>
    </Modal>
  );
}

function NewIncomeForm({ onSubmit }) {

  const { currentUser } = useAuth(); 
  const user = localStorage?.userId;
  
    const [incomeDay, setIncomeDay] = useState('');
    const [incomeMonth, setIncomeMonth] = useState('');
    const [incomeYear, setIncomeYear] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeSource, setIncomeSource] = useState('');
  
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

      if (
        !incomeDay ||
        !incomeMonth ||
        !incomeYear ||
        !incomeAmount ||
        !incomeSource
      ) {
        setIsSubmitting(false);
        return;
      }
  
      const formattedDate = `${incomeMonth}/${incomeDay}/${incomeYear}`;

      // post request to add new entry to database
      try {
        const recentIncome = await axios.get('http://localhost:8081/api/income/latest');
        const mostRecentIncomeId = recentIncome.data.income_id;
        const newIncomeId = mostRecentIncomeId + 1;

        const newIncome = {income_id: newIncomeId, 
                            user_id: user, 
                            bank_id: user, 
                            date: formattedDate, 
                            amount: incomeAmount, 
                            source: incomeSource};
        const response = await axios.post('http://localhost:8081/api/income/insert', newIncome);
        
        setIsSubmitting(false);
        setSuccess('Data successfully saved!');
        console.log('New Income ID: ', newIncomeId);
        console.log('Data saved: ', response.data);
        onSubmit();
      } catch (err) {
        setIsSubmitting(false);
        setError('Something went wrong! Please try again.');
        console.error(err);
      }
    };
  
    return (
     <Form className = "form">
        <Form.Group className="mb-3" controlId="formIncomeSource">
          <Form.Label>Source</Form.Label>
          <Form.Control className = "input" type="string" placeholder='e.g. Gambling'
           value={incomeSource}
            onChange = {(e) => setIncomeSource(e.target.value)}
            required/>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formIncomeDay">
          <Form.Label>Day</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 08"
           value={incomeDay}
             onChange = {(e) => setIncomeDay(e.target.value)}
             required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formIncomeMonth">
          <Form.Label>Month</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 05"
           value={incomeMonth}
             onChange = {(e) => setIncomeMonth(e.target.value)}
             required/>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formIncomeYear">
          <Form.Label>Year</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 2021"
           value={incomeYear}
             onChange = {(e) => setIncomeYear(e.target.value)}
             required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formIncomeAmount">
          <Form.Label>Amount</Form.Label>
          <Form.Control type="number" placeholder=" e.g. 5000"
           value={incomeAmount}
             onChange = {(e) => setIncomeAmount(e.target.value)}
             required/>
        </Form.Group>
  
        {/* submit button  */}
        <Button type = "submit" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? 'Adding Income...' : 'Add Income'} </Button>
      </Form>
    );
  }

  //  modal for adding new goal
function NewIncomeModal(props) {
  const handleClose = () => {
    props.onHide(); // Close the modal using the onHide prop from props
  };
  const handleFormSubmit = () => {
    // Close the modal after submission
    handleClose();
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
          Add Income
        </Modal.Title>
      <CloseButton className="btn-close-white" onClick = {handleClose} style={{ color: 'white !important' }} />
      </Modal.Header>
      <Modal.Body>
        <NewIncomeForm onSubmit={handleFormSubmit} />
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

  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(true);

  const showExpenseTable = () => {
    setShowIncome(false);
    setShowExpense(true);
  };

  const showIncomeTable = () => {
    setShowIncome(true);
    setShowExpense(false);
  };

  // variable for showing or hiding modal
  const [expenseModalShow, setExpenseModalShow] = useState(false);
  const [incomeModalShow, setIncomeModalShow] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Return early if still determining auth status

    const token = localStorage.getItem('authToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    const fetchIncome = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/income/show/' + userId);
        const sortedIncome = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setIncome(sortedIncome);
      } catch (err) {
        console.error("Error fetching income:", err);
      }
    };

    const fetchExpense = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/expense/show/' + userId);
        const sortedExpense = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpense(sortedExpense);
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
      <div className="add-both">
        <div className="add-expense">
          <Button variant="primary" className="expense-button" onClick={() => setExpenseModalShow(true)}>
            Add expense
          </Button>
          <NewExpenseModal
            show={expenseModalShow}
            onHide={() => setExpenseModalShow(false)}
          />
        </div>
        <div className="add-income">
          <Button variant="primary" className="income-button" onClick={() => setIncomeModalShow(true)}>
            Add income
          </Button>
          <NewIncomeModal
            show={incomeModalShow}
            onHide={() => setIncomeModalShow(false)}
          />
        </div>
      </div>
      <div className="button-container">
        <button className={`show-income-button ${showIncome ? 'income-active' : ''}`} 
        onClick={showIncomeTable}>Income</button>
        <button className={`show-expense-button ${showExpense ? 'expense-active' : ''}`}
        onClick={showExpenseTable}>Expenses</button>
      </div>
      <div className="bothTables">
        {showIncome ? (
          <table className="incomeTable">
            <thead>
              <tr>
                <th>Date
                  <button className="headButton" onClick={sortIncomeByDate}>↑</button>
                  <button className="headButton" onClick={sortIncomeByDateDescending}>↓</button>
                </th>
                <th>Amount
                  <button className="headButton" onClick={sortIncomeByAmount}>↑</button>
                  <button className="headButton" onClick={sortIncomeByAmountDescending}>↓</button>
                </th>
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
        ) : null}
        {showExpense ? (
          <table className="expenseTable">
            <thead>
              <tr>
                <th>Date
                  <button className="headButton" onClick={sortExpenseByDate}>↑</button>
                  <button className="headButton" onClick={sortExpenseByDateDescending}>↓</button>
                </th>
                <th>Amount
                  <button className="headButton" onClick={sortExpenseByAmount}>↑</button>
                  <button className="headButton" onClick={sortExpenseByAmountDescending}>↓</button>
                </th>
                <th>Category
                  <button className="headButton" onClick={sortExpenseByCategory}>↑</button>
                  <button className="headButton" onClick={sortExpenseByCategoryDescending}>↓</button>
                </th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {
                expense.map(expense => {
                  return <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>${expense.amount}</td>
                    <td>{expense.category_name}</td>
                    <td>{expense.description}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}

export default Transaction;
