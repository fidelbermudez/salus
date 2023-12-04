import React, { useState } from 'react';
import { Card, ProgressBar, Button } from 'react-bootstrap';
import { currencyFormatter } from './utils';
import '../styles/budget.css';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { FiX } from 'react-icons/fi';
import ConfirmDeleteCard from './confirmDeleteBudget';

export default function BudgetCard({ name, amount, max, grey, categoryId, deletable, customStyle, bool, setBool, bool2 }) {
  const [delShow, setDelShow] = useState(false);

  const cardClassNames = () => {
    const classNames = ['Budgetcard'];

    if (amount > max) {
      classNames.push('bg-danger', 'bg-opacity-10');
    } else if (grey) {
      classNames.push('bg-light');
    }

    return classNames.join(' ');
  };

  const num = amount / max;
  const prog = isNaN(num) ? '0' : `${Math.round(num * 100)}%`;

  return (
    <Card className={cardClassNames()} style={name === 'Total Budget' ? customStyle : null}>
      <div className="pointer">
        <div className="placement-button">
          {deletable && (
            <Button className="trash-icon" onClick={() => setDelShow(true)}>
              <FiX id="xdel" />
            </Button>
          )}
        </div>
      </div>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal">
          <div className="cardName">{name}</div>
        </Card.Title>
        {bool2 && <ProgressBar style={{ height: '25px' }} />}
        {!bool2 && <ProgressBar
          //className="rounded-pill"
          variant={getProgressBarVariant(amount, max)}
          min={0}
          max={max}
          now={amount}
          label={`${prog}`}
          style={{ height: '25px' }}
        />}
        <div className="amount-max">
          {currencyFormatter.format(amount)}
          <span className="fs-6 ms-1">/ {currencyFormatter.format(max)}</span>
        </div>
      </Card.Body>
      <ConfirmDeleteCard show={delShow} onHide={() => setDelShow(false)} categoryId={categoryId} bool={bool} setBool={setBool} />
    </Card>
  );
}

function getProgressBarVariant(amount, max) {
  const ratio = amount / max;
  if (ratio < 0.5) return 'primary';
  if (ratio < 0.75) return 'warning';
  return 'danger';
}
