import { Card, ProgressBar, Stack } from "react-bootstrap";
import { currencyFormatter } from "./utils";
import '../styles/budget.css';
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import { useAuth } from '../AuthContext';
import {MdDeleteForever} from 'react-icons/md';

export default function BudgetCard({ name, amount, max, grey, categoryId, deletable}) {
    const classNames = []
    if (amount > max) {
        classNames.push("bg-danger", "bg-opacity-10")
    } else if (grey) {
        classNames.push("bg-light")
    }

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleDeleteElement = async (categoryId) => {
        console.log('Deleting budget with categoryId:', categoryId);
        try {
          const response = await axios.delete(`http://localhost:8081/api/category/delete/${categoryId}`);
          if (response.status === 200) {
            console.log('Budget deleted successfully.');
            setSuccess('Element deleted successfully');
            window.location.reload();
          } else {
            console.log('Budget deleted successfully.');
            setError('Element not found');
          }
        } catch (err) {
          console.log('Budget deleted successfully.');
          setError('Something went wrong! Please try again.');
        }
      };


    return (
        <Card className={classNames.join(" ")}>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between 
                align-items-baseline fw-normal">
                <div className="me-2">{name}</div>
                <div className="d-flex align-items-baseline">
                    {currencyFormatter.format(amount)}
                    <span className="text-muted fs-6 ms-1">
                     / {currencyFormatter.format(max)}
                    </span>
                </div>
                </Card.Title>
                <ProgressBar 
                    className="rounded-pill" 
                    variant={getProgressBarVariant(amount, max)}
                    min={0}
                    max={max}
                    now={amount}

                />
                {/* This is for the trash icon used to click on when you want to delete an indivdual budget (card) */}
                <div class="pointer">
                <div className="temp">
                {deletable &&(
                    <MdDeleteForever 
                        className="trash-icon" 
                        onClick={() => { handleDeleteElement(categoryId); window.location.reload(); }}
                    />
                )}     
                </div>
                </div>

            </Card.Body>
        </Card>
    )
}

function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < .5) return "primary"
    if (ratio < 0.75) return "warning"
    return "danger"
}