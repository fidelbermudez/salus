import React from 'react';
import '../styles/savings.css'

function SavingsCategory({ name, saved, goal }) {
  return (
    <div className="savings-cat">
      <h2> {name} </h2>
      <h4> ${saved}/${goal} </h4>
    </div>
  );
}

export default SavingsCategory;
