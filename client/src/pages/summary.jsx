import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarGraph from '../components/barGraph.jsx'; // Import the 3D bar graph component

function Summary() {
  const [userId, setUserId] = useState(4);
  const [expenseInfo, setExpenseInfo] = useState([]);
  const [budgetInfo, setBudgetInfo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenseInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/expense/user/${userId}`);
        console.log(response.data, "test1");
        setExpenseInfo(response.data);
      } catch (e) {
        setError(e.message || 'Failed to fetch expense info');
        console.error(e);
      }
    };

    const fetchBudgetInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/budgetSummary/user/${userId}`);
        setBudgetInfo(response.data);
      } catch (e) {
        setError(e.message || 'Failed to fetch budget info');
        console.error(e);
      }
    };

    fetchBudgetInfo();
    fetchExpenseInfo();
  }, [userId]);

  return (
    <div>
      <h1> Welcome to your Summary!</h1>
      <ul>
        {expenseInfo.map((expense) => (
          <li key={expense._id}>{expense.description}, {expense.category_id}, {expense.date} </li>
        ))}
      </ul>
      <ul>
        {budgetInfo.map((budget) => (
          <li key={budget.budget_id}>{budget.limit}, {budget.category_id}</li>
        ))}
      </ul>
      <p>test0</p>
      <BarGraph/>
      <p>test1</p>
    </div>
  );
}

export default Summary;





