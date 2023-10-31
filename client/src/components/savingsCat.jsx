import React from 'react';
import '../styles/savings.css'
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
// import { currencyFormatter } from "./utils";


function getProgressBarVariant(saved, goal) {
    const ratio = saved / goal
    if (ratio < 1) return "primary"
    return "warning"
}

function SavingsCategory({ name, saved, goal}) {

  const currencyFormatter = new Intl.NumberFormat(undefined, {
    currency: "usd",
    style: "currency",
    minimumFractionDigits: 0,
  })

  const classNames = []
  if (saved > goal) {
        classNames.push("bg-danger", "bg-opacity-10")
  }
  
  const prog = saved/goal;
  console.log(prog, saved, goal)
  return (
    <Card style={{ width: '500rem' }}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between 
            align-items-baseline fw-normal">
            <div className="me-2">{name}:</div>
              <div className="d-flex align-items-baseline">
                {currencyFormatter.format(saved)}
                <span className="text-muted fs-6 ms-1">
                 / {currencyFormatter.format(goal)}
                </span>
              </div>
        </Card.Title>
        <ProgressBar 
          className="rounded-pill" 
          variant={getProgressBarVariant(saved, goal)}
          min={0}
          max={goal}
          now={saved}
          label={`${prog}%`}
          />
      </Card.Body>
    </Card>

    // <div className="savings-cat">
    //   <h2> {name} </h2>
    //   <h4> ${saved}/${goal} </h4>
    // </div>
  );
}

export default SavingsCategory;


// export default function BudgetCard({ name, amount, max, grey }) {
//     const classNames = []
//     if (amount > max) {
//         classNames.push("bg-danger", "bg-opacity-10")
//     } else if (grey) {
//         classNames.push("bg-light")
//     }

//     return (
//         <Card className={classNames.join(" ")}>
//             <Card.Body>
//                 <Card.Title className="d-flex justify-content-between 
//                 align-items-baseline fw-normal">
//                 <div className="me-2">{name}</div>
//                 <div className="d-flex align-items-baseline">
//                     {currencyFormatter.format(amount)}
//                     <span className="text-muted fs-6 ms-1">
//                      / {currencyFormatter.format(max)}
//                     </span>
//                 </div>
//                 </Card.Title>
//                 <ProgressBar 
//                     className="rounded-pill" 
//                     variant={getProgressBarVariant(amount, max)}
//                     min={0}
//                     max={max}
//                     now={amount}

//                 />
//             </Card.Body>
//         </Card>
//     )
// }


