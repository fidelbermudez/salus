import React, { useEffect, useState } from 'react';
import BarGraph from '../components/barGraph.jsx'; 
import PieChart from '../components/pieChart.jsx';

function Summary() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [active, setActive] = useState(false);
  const [month, setMonth] = useState(null);
  const [limit, setLimit] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const decreaseYear = () => {
    setYear(year - 1);
    setActive(false);
  };

  const increaseYear = () => {
    setYear(year + 1);
    setActive(false);
  };

  return (
    <div style={{textAlign: 'center', margin: '2%'}}>
      <h2>Budget History</h2>
      <div>
        <h5>
          <button style={{ backgroundColor: 'white', border: "1px solid black"}} onClick={decreaseYear}>{'<'}</button>
          {`  ${year}  `}
          <button style={{ backgroundColor: 'white', border: "1px solid black"}} onClick={increaseYear}>{'>'}</button>
        </h5>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
      <BarGraph key={year} year={year} setMonth={setMonth} setActive={setActive} setLimit={setLimit} setExpenses={setExpenses}/>
      <PieChart month={month} year={year} active={active} limit={limit} expenses={expenses}/>
      </div>
    </div>
  );
}

export default Summary;