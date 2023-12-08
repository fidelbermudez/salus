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
      <div style={{textAlign: 'center', margin: '3%', padding: '2%', borderRadius: '30px', border: '1px solid #d1d1d1', background: '#f2f2f2'}}>
        <h2 style={{marginTop: '1%'}}>Savings History</h2>
        <div>
          <h5>
          <button
            style={{
              border: "none",
              transition: "background-color 0.3s",
              cursor: "pointer"
            }}
            onClick={decreaseYear}
            className="custom-button"
          >
            {'<'}
          </button>
          {`  ${year}  `}
          <button
            style={{
              border: "none",
              transition: "background-color 0.3s",
              cursor: "pointer"
            }}
            onClick={increaseYear}
            className="custom-button"
          >
            {'>'}
          </button>
        </h5>
        </div>
        <div style={{display: "flex", justifyContent: "center"}}>
        <SavingsGraph year={year}/>
        </div>
      </div>
    );
}

export default SavingsSummary;