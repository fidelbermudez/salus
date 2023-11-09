import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarGraph from '../components/barGraph.jsx'; 
import { useAuth } from '../AuthContext'; 

function Summary() {
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
      <h4>Budget History</h4>
      <div>
        <button onClick={decreaseYear}>{"<"}</button>
        <h5>{year}</h5>
        <button onClick={increaseYear}>{">"}</button>
      </div>
      <BarGraph key={year} year={year} />
    </div>
  );
}

export default Summary;
