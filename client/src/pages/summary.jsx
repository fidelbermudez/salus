import React, { useEffect, useState } from 'react';
import BarGraph from '../components/barGraph.jsx'; 
import PieChart from '../components/pieChart.jsx';

function Summary() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [active, setActive] = useState(false);
  const [month, setMonth] = useState(null);

  const decreaseYear = () => {
    setYear(year - 1);
    setActive(false);
  };

  const increaseYear = () => {
    setYear(year + 1);
    setActive(false);
  };

  return (
    <div>
      <h1>Welcome to your Summary!</h1>
      <br />
      <h1>Budget History</h1>
      <div>
        <button onClick={decreaseYear}>{"<"}</button>
        <h5>{year}</h5>
        <button onClick={increaseYear}>{">"}</button>
      </div>
      <BarGraph key={year} year={year} setMonth={setMonth} setActive={setActive}/>
      <PieChart month={month} year={year} active={active}/>
    </div>
  );
}

export default Summary;
