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
import CsvDownloadButton from '../components/transactionsDownload.jsx';

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
      const dayWithLeadingZero = expenseDay.length === 1 ? `0${expenseDay}` : expenseDay;
      const monthWithLeadingZero = expenseMonth.length === 1 ? `0${expenseMonth}` : expenseMonth;
      const formattedDate = `${monthWithLeadingZero}/${dayWithLeadingZero}/${expenseYear}`;

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
        window.location.reload();
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
  
      const dayWithLeadingZero = incomeDay.length === 1 ? `0${incomeDay}` : incomeDay;
      const monthWithLeadingZero = incomeMonth.length === 1 ? `0${incomeMonth}` : incomeMonth;
      const formattedDate = `${monthWithLeadingZero}/${dayWithLeadingZero}/${incomeYear}`;

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
        window.location.reload();
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

  const [startSearchDate, setStartSearchDate] = useState('');
  const [endSearchDate, setEndSearchDate] = useState('');

  const [filteredIncome, setFilteredIncome] = useState([]);
  const [filteredExpense, setFilteredExpense] = useState([]);

  const handleStartDateChange = (e) => {
    setStartSearchDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndSearchDate(e.target.value);
  };

  const handleSearch = () => {
    // Convert the start and end date strings to Date objects
    const startDate = new Date(startSearchDate);
    const endDate = new Date(endSearchDate);

    // Filter income data based on the selected date range
    const filteredIncomeData = income.filter((incomeItem) => {
      const incomeDate = new Date(incomeItem.date);
      return incomeDate >= startDate && incomeDate <= endDate;
    });

    // Filter expense data based on the selected date range
    const filteredExpenseData = expense.filter((expenseItem) => {
      const expenseDate = new Date(expenseItem.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    // Set the filtered data in your component state
    setFilteredIncome(filteredIncomeData);
    setFilteredExpense(filteredExpenseData);
  };

  useEffect(() => {
    // Automatically trigger the search when startSearchDate or endSearchDate change
    if (startSearchDate && endSearchDate) {
      handleSearch();
    }
  }, [startSearchDate, endSearchDate]);

  const [selectedCsvFile, setCsvFile] = useState(null);

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleUploadCsv = () => {
    // Check if a CSV file is selected
    if (!selectedCsvFile) {
      console.error('CSV file is missing.');
      return;
    }
  
    // Read the first row of the CSV file to inspect headers
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      const firstRow = contents.split('\n')[0].toLowerCase(); // Assuming headers are in the first row
  
      // Check if the headers match the expected format for expenses or income
      if (firstRow.includes('category') && firstRow.includes('amount')) {
        // The headers match the expected format for expenses
        // Send the CSV file to the upload-expenses route
        sendToExpensesRoute(userId, selectedCsvFile);
      } else if (firstRow.includes('source') && firstRow.includes('amount')) {
        // The headers match the expected format for income
        // Send the CSV file to the upload-income route
        sendToIncomeRoute(userId, selectedCsvFile);
      } else {
        // Handle the case where the headers don't match either format
        console.error('CSV headers do not match expected formats.');
      }
    };
  
    reader.readAsText(selectedCsvFile);
  };

  // Function to send the CSV data to the upload-expenses route
  const sendToExpensesRoute = (userId, csvFile) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('bank_id', userId);
    formData.append('csvFile', csvFile);
  
    // Use POST request to upload expenses
    axios.post('http://localhost:8081/api/expense/upload-expenses', formData)
      .then((response) => {
        window.location.reload();
        console.log('Expenses CSV data uploaded successfully');
  
        // Use PUT request to update budgets from CSV
        axios.put('http://localhost:8081/api/category/incrementAmountCsv', formData)
          .then((response) => {
            console.log('Budgets updated successfully from CSV');
          })
          .catch((error) => {
            console.error('Error updating budgets from CSV:', error);
          });
      })
      .catch((error) => {
        console.error('Error uploading Expenses CSV data:', error);
      });
  };
  
  // Function to send the CSV data to the upload-income route
  const sendToIncomeRoute = (userId, csvFile) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('bank_id', userId);
    formData.append('csvFile', csvFile);
  
    axios.post('http://localhost:8081/api/income/upload-income', formData)
      .then((response) => {
        window.location.reload();
        console.log('Income CSV data uploaded successfully');
      })
      .catch((error) => {
        console.error('Error uploading Income CSV data:', error);
      });
  };

  return (
    <div className="everything" style={{padding: '2%', paddingBottom: "4%", width: '90%', marginLeft: '5%', marginTop: '8%', background: '#f2f2f2', borderRadius: '80px', border: '1px solid #d1d1d1'}}>
      <div className = "transactions" style={{marginLeft: '40%', color: '#5e70c2', marginBottom: '1%'}}> 
          <h2 id="transactions-title">Your Transactions </h2>
      </div>
      <div className="add-both">
        <div className="upload-button-container">
          <div className="input-csv">
            <div className="download-csv">
              <CsvDownloadButton/>
            </div>
            <input type="file" accept=".csv" onChange={handleCsvFileChange} />
            <button onClick={handleUploadCsv}>Upload</button>
          </div>
        </div>
        <div className="button-container2">
          <div className="see-history">
            <Button variant="primary" className="income-button" onClick={() => setIncomeModalShow(true)}>
              See history
            </Button>
            <NewIncomeModal
              show={incomeModalShow}
              onHide={() => setIncomeModalShow(false)}
            />
          </div>
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
        <div className="search-income-expense">
          <div className="date-input-container">
          <label htmlFor="startDate" className="date-label">Start Date</label>
          <input
            type="date"
            placeholder="Start Date"
            value={startSearchDate}
            onChange={handleStartDateChange}
          />
          </div>
          <div className="date-input-container">
          <label htmlFor="endDate" className="date-label">End Date</label>
          <input
            type="date"
            placeholder="End Date"
            value={endSearchDate}
            onChange={handleEndDateChange}
          />
          </div>
        </div>
      </div>
      <div className="button-container">
        <button className={`show-expense-button ${showExpense ? 'expense-active' : ''}`}
        onClick={showExpenseTable}>Expenses</button>
        <button className={`show-income-button ${showIncome ? 'income-active' : ''}`} 
        onClick={showIncomeTable}>Income</button>
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
              {startSearchDate || endSearchDate ? (
                filteredIncome.map((income) => (
                  <tr key={income.id}>
                    <td>{income.date}</td>
                    <td>${income.amount}</td>
                    <td>{income.source}</td>
                  </tr>
                ))
              ) : (
                income.map((income) => (
                  <tr key={income.id}>
                    <td>{income.date}</td>
                    <td>${income.amount}</td>
                    <td>{income.source}</td>
                  </tr>
                ))
              )}
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
              {startSearchDate || endSearchDate ? (
                filteredExpense.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>${expense.amount}</td>
                    <td>{expense.category_name}</td>
                    <td>{expense.description}</td>
                  </tr>
                ))
              ) : (
                expense.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>${expense.amount}</td>
                    <td>{expense.category_name}</td>
                    <td>{expense.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}

export default Transaction;
