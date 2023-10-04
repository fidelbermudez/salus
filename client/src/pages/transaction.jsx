import React from 'react';
import { useEffect, useState } from 'react';
import "../styles/transactions.css";
import axios from 'axios';

function Transaction() {
  const [income, setIncome] = useState([]);
  useEffect(()=> {
    axios.get('http://localhost:8081/api/income/show/4')
    .then(income => setIncome(income.data))
    .catch(err => console.log(err))
  }, [])

  const [expense, setExpense] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8081/api/expense/show/4')
    .then(expense => setExpense(expense.data))
    .catch(err => console.log(err))
  })

  return (
    <div>
      <div>
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
      </div>
      <div>
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
      </div>
    </div>
  );
}

export default Transaction;
