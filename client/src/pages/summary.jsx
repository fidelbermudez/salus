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
    <div>
      <h1>Welcome to your Summary!</h1>
      <br />
      <h1 style={{textAlign: 'center', margin: '12px'}}>Budget History</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft:"375px"}}>
        <button style={{ backgroundColor: 'white', border: "1px solid black"}} onClick={decreaseYear}>{'<'}</button>
        <h5 style={{ textAlign: 'center', marginLeft: "10px", marginRight: "10px"}}>{year}</h5>
        <button style={{ backgroundColor: 'white', border: "1px solid black"}} onClick={increaseYear}>{'>'}</button>
      </div>
      <div style={{display: 'flex'}}>
      <BarGraph key={year} year={year} setMonth={setMonth} setActive={setActive} setLimit={setLimit} setExpenses={setExpenses}/>
      <PieChart month={month} year={year} active={active} limit={limit} expenses={expenses}/>
      </div>
    </div>
  );
}

export default Summary;
