import React from 'react';
import { useEffect, useState } from 'react';
import "../styles/transactions.css";
import axios from 'axios';
import { useAuth } from '../AuthContext'; 

const user = 4;

function Transaction() {

const { currentUser } = useAuth(); 
const userId = currentUser?.userId;
const token = localStorage.getItem('authToken');
axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  const [income, setIncome] = useState([]);
  useEffect(()=> {
    axios.get('http://localhost:8081/api/income/show/' + userId)
    .then(income => setIncome(income.data))
    .catch(err => console.log(err))
  }, [])

  const [expense, setExpense] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8081/api/expense/show/' + userId)
    .then(expense => setExpense(expense.data))
    .catch(err => console.log(err))
  }, [])

  const [toggle, setToggle] = useState(false);
  const handleToggleChange = () => {
    setToggle(!toggle);
  };

  return (
    <div>
      <button className="toggle-button" onClick={handleToggleChange}>
        {toggle ? "Show Expenses" : "Show Income"}
      </button>
      <div className = "bothTables">
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
                return <tr>
                  <td>{income.date}</td>
                  <td>${income.amount}</td>
                  <td>{income.source}</td>
                </tr>
              })
            }
          </tbody>
        </table>
        ) : (
          <table className = "expenseTable">
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
                expense.map(expense => {
                  return <tr>
                    <td>{expense.date}</td>
                    <td>${expense.amount}</td>
                    <td>{expense.category_id}</td>
                    <td>{expense.description}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transaction;
