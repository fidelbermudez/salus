import React from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from "react";
import axios from 'axios'
import '../css_files/budget.css';
import { useAuth } from '../AuthContext'; 

function Budget() {
  const { currentUser } = useAuth(); 
  const userId = currentUser?.userId;

  //This is the set up for making a valid GET request using Axios
  const [budgetId, setBudgetId] = useState('');
  const [specificBudget, setSpecificBudget] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState([]);

  const token = localStorage.getItem('authToken');
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  useEffect(() => {
    axios.get('http://localhost:8081/api/budgetSummary/all')
    .then(response => setBudgetSummary(response.data))
    .catch(error => console.error(error));
  }, []);
  //

  const handleFetchBudget = () => {
    axios.get(`http://localhost:8081/api/budgetSummary/budget/${userId}`)
      .then((response) => {
        setSpecificBudget(response.data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Container className="my-4">
    <h1> Budgeting </h1>
      <Stack direction="horizontal" gap="2" className="mb-4">
      <h1 className="me-auto"> Current Budgets </h1>
      <div>
        <input
          type="text"
          placeholder="Enter Budget ID"
          value={budgetId}
          onChange={(e) => setBudgetId(e.target.value)}
        />
        <Button variant="primary" onClick={handleFetchBudget}>
          Fetch Budget
        </Button>
      </div>      
      {specificBudget && (
        <div className="budget-card">
          <p>Budget ID: {specificBudget.budget_id}</p>
      
          <p>Limit: {specificBudget.limit}</p>
          <p>Amount Spent: {specificBudget.amount_spent}</p>
          <p>Category ID: {specificBudget.category_id}</p>
        </div>
      )}
      </Stack>
      <div style={{ 
        display:"grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1rem",
        alignItems: "flex-start",
        }}
      >
      </div>
      <div>
      <ul>
        {budgetSummary.map((budget) => (
          <div key={budget._id } className="budget-card">
            <p>Budget ID: {budget.budget_id}</p>
            <p>Limit: {budget.limit}</p>
            <p>Amount Spent: {budget.amount_spent}</p>
            <p>Category ID: {budget.category_id}</p>
          </div>
        ))}
      </ul>
    </div>
    
    </Container>
  );
}

export default Budget;
