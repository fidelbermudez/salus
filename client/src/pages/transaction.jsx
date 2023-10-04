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
    <div className="w-100 vh-100 d-flex justify-content-center">
      <div className="w-70">
      <table className = "incomeTable">
        <thead className = "incomeHead">
          <tr>
            <th className = "incDateHead">Date</th>
            <th className = "incAmountHead">Amount</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {
            income.map(income => {
              return <tr className = "incomeBody">
                <td className = "incomeDate">{income.date}</td>
                <td className = "incomeAmount">{income.amount}</td>
                <td>{income.source}</td>
              </tr>
            })
          }
        </tbody>
      </table>
      </div>
      <div className="w-200">
          <table className = "expenseTable">
            <thead className = "expenseHead">
              <tr>
                <th className = "expDateHead">Date</th>
                <th className = "expAmountHead">Amount</th>
                <th className = "expCategoryHead">Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {
                expense.map(expense => {
                  return <tr className = "expenseBody">
                    <td className = "expenseDate">{expense.date}</td>
                    <td className = "expenseAmount">{expense.amount}</td>
                    <td className = "expenseCategory">{expense.category_id}</td>
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
