import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Summary() {
  const [userId, setUserId] = useState(4);
  const [expenseInfo, setExpenseInfo] = useState([]);
  const [incomeInfo, setIncomeInfo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenseInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/expense/all');
        console.log(response.data, "test1");

        const filteredExpenses = response.data.filter((expense) => expense.user_id === userId);
        console.log(filteredExpenses, "test3");

        setExpenseInfo(filteredExpenses);
      } catch (e) {
        setError(e.message || 'Failed to fetch expense info');
        console.error(e);
      }
    };

    const fetchIncomeInfo = async () => {
        try {
          const response = await axios.get('http://localhost:8081/api/income/all');
          console.log(response.data, "test1");
  
          const filteredIncomes = response.data.filter((income) => income.user_id === userId);
          console.log(filteredIncomes, "test3");
  
          setIncomeInfo(filteredIncomes);
        } catch (e) {
          setError(e.message || 'Failed to fetch income info');
          console.error(e);
        }
    };

    fetchIncomeInfo();
    fetchExpenseInfo();
  }, [userId]);

  return (
    <div>
      <h1> Welcome to your Summary!</h1>
      <ul>
        {expenseInfo.map((expense) => (
          <li key={expense._id}>{expense.description}</li>
        ))}
      </ul>
      <ul>
        {incomeInfo.map((income) => (
          <li key={income._id}>{income.source}</li>
        ))}
      </ul>
    </div>
  );
}

export default Summary;





