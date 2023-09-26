import React from 'react';
import "../styles/savings.css"

function Savings() {
  return (
    <div className="Saving">
      <h1> Savings </h1>

      {/* box displaying total savings across all accounts */}
      <div className="total-savings"> 
        <h3>Total Savings </h3>
        <p> test </p>
      </div>

      {/* button that allows user to add a new savings goal */}
      <button className = "add"> Add new savings goal </button>
      
      {/* display of existing savings goals and goal progress */}
      <div className = "goals"> 
        <h3>Your Saving Goals </h3>
      </div>

    </div>
  );
}

export default Savings;


