import TransactionsGraph from "../components/transactionsGraph";
import React, {useState } from 'react';

const TransactionSummary = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    const decreaseYear = () => {
      setYear(year - 1);
    };
  
    const increaseYear = () => {
      setYear(year + 1);
    };
  
    return (
    <div style={{textAlign: 'center', margin: '2%'}}>
        <h1>Welcome to your Summary!</h1>
        <br />
        <h2>Transaction History</h2>
        <div>
          <h5>
            <button style={{ backgroundColor: 'white', border: "1px solid black"}} onClick={decreaseYear}>{'<'}</button>
            {`  ${year}  `}
            <button style={{ backgroundColor: 'white', border: "1px solid black"}} onClick={increaseYear}>{'>'}</button>
          </h5>
        </div>
        <div style={{display: "flex", justifyContent: "center"}}>
            <TransactionsGraph key={year} year={year} />
        </div>
    </div>
    );
}

export default TransactionSummary;