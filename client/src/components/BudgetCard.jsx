import React from 'react';
import { Card, ProgressBar, Stack } from "react-bootstrap";
import { currencyFormatter } from "./utils";
import '../styles/budget.css';
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import { useAuth } from '../AuthContext';
import {MdDeleteForever} from 'react-icons/md';
import {FiX} from 'react-icons/fi';
import ConfirmDeleteCard from './confirmDeleteBudget';

 
export default function BudgetCard({ name, amount, max, grey, categoryId, deletable, customStyle, bool, setBool}) {
    const cardClassNames = () => {
        const classNames = ["Budgetcard"];

        if (amount > max) {
            classNames.push("bg-danger", "bg-opacity-10");
        } else if (grey) {
            classNames.push("bg-light");
        }

        return classNames.join(" ");
    };
 
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
 
    {/* want I used before to delete a budget card

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
      }; */}

        // calculate percentage contributed toward max budget based on contirbuted amount
        const num = amount/max;
        //const prog = Math.round(num * 100);
        //this is the const prog to use below if you want to replace NaN with 0 when there are no budgets for a month
        const prog = isNaN(num) ? '0' : `${Math.round(num * 100)}%`;

        // help with showing the pop up asking if you really want to delete a budget card
        const[delShow, setDelShow] = React.useState(false);
 
 
        // style={name === "Total Budget" ? customStyle : null} <- helps to make total budget card different
    return (
        <Card className={cardClassNames()} style={name === "Total Budget" ? customStyle : null}>

            <div class="pointer">
            <div className="placement-button">
                {deletable &&(
                    <Button className="trash-icon" onClick={() => setDelShow(true)}>
                  <FiX id="xdel"/>
                </Button>
                
                )}
            </div>
            </div>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between
                align-items-baseline fw-normal">
                <div className="cardName">{name}</div>
               
                </Card.Title>
                <ProgressBar
                    className="rounded-pill"
                    variant={getProgressBarVariant(amount, max)}
                    min={0}
                    max={max}
                    now={amount}
                    label={`${prog}%`}
                    style= {{height: "25px"}}
                />
                 <div className="amount-max">
                    {currencyFormatter.format(amount)}
                    <span className="text-muted fs-6 ms-1">
                     / {currencyFormatter.format(max)}
                    </span>
                </div>
                {/* This is for the trash icon used to click on when you want to delete an indivdual budget (card) */}
                
 
            </Card.Body>
            <ConfirmDeleteCard
                show={delShow}
                onHide={() => setDelShow(false)}
                categoryId={categoryId}
                bool={bool}
                setBool={setBool}
                />
        </Card>
    )
}
 
function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < .5) return "primary"
    if (ratio < 0.75) return "warning"
    return "danger"
}