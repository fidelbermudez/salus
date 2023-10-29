import React, { useEffect, useState } from 'react';
import "../styles/transactions.css";
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import { local } from 'd3';

function Transaction() {

  const { currentUser, isLoading: authLoading } = useAuth();  // get isLoading state from AuthContext
  const userId = localStorage?.userId;
  
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [toggle, setToggle] = useState(false);

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

  return (
    <div>
      <button className="toggle-button" onClick={handleToggleChange}>
        {toggle ? "Show Expenses" : "Show Income"}
      </button>
      <div className="bothTables">
        {toggle ? (
          <table className="incomeTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {
                income.map(income => (
                  <tr key={income.id}>
                    <td>{income.date}</td>
                    <td>${income.amount}</td>
                    <td>{income.source}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        ) : (
          <table className="expenseTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {
                expense.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>${expense.amount}</td>
                    <td>{expense.category_id}</td>
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
