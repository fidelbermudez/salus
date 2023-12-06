import React, { useEffect, useState } from 'react';
import BarGraph from '../components/barGraph.jsx'; 
import PieChart from '../components/pieChart.jsx';

function Summary({yr, setCurrYear, setCurrMonth}) {
  const [year, setYear] = useState(yr);
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
    <div style={{textAlign: 'center', margin: '3%', padding: '3%', borderRadius: '60px', border: '1px solid #d1d1d1', background: '#f2f2f2'}}>
      <h2 style={{marginTop: '1%'}}>Budget History</h2>
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
        <BarGraph key={year} year={year} setMonth={setCurrMonth} setYear={setCurrYear} setActive={setActive} setLimit={setLimit} setExpenses={setExpenses}/>
      {/* <PieChart month={month} year={year} active={active} limit={limit} expenses={expenses}/> */}
      </div>
    </div>
  );
}

export default Summary;