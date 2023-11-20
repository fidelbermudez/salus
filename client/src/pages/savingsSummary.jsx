import SavingsGraph from "../components/savingsGraph";
import React, {useState } from 'react';

const SavingsSummary = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    const decreaseYear = () => {
      setYear(year - 1);
    };
  
    const increaseYear = () => {
      setYear(year + 1);
    };
  
    return (
      <div>
        <h1>Welcome to your Summary!</h1>
        <br />
        <h1 style={{textAlign: 'center', margin: '12px'}}>Savings History</h1>
        <div>
          <h5 style={{ textAlign: 'center'}}>
            <button style={{ backgroundColor: 'white', border: "1px solid black"}} onClick={decreaseYear}>{'<'}</button>
            {year}
            <button style={{ backgroundColor: 'white', border: "1px solid black"}} onClick={increaseYear}>{'>'}</button>
          </h5>
        </div>
        <div style={{display: "flex", justifyContent: "center"}}>
        <SavingsGraph year={year}/>
        </div>
      </div>
    );
}

export default SavingsSummary;