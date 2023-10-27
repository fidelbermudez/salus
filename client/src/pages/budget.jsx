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

function Budget() {
  const { currentUser } = useAuth(); 
  const userId = localStorage?.userId;

  //This is the set up for making a valid GET request using Axios
  const [budgetId, setBudgetId] = useState('');
  const [specificBudget, setSpecificBudget] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:8081/api/budgetSummary/all')
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
    <>
    <Container className="my-4">
      <Stack direction="horizontal" gap="2" className="mb-4">
      <h1 className="me-auto"> Your Budgets </h1>
      <Button variant="primary"> Add Budget </Button>
    
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
        <BudgetCard name="Entertainment" amount={200} max={1000}></BudgetCard>
        <BudgetCard name="Food" amount={600} max={1000}></BudgetCard>
        <BudgetCard name="leisure" amount={900} max={1000}></BudgetCard>
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
    <AddBudgetModal show />
   
    </>
  );
}

export default Budget;
