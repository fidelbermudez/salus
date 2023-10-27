import { Card, ProgressBar, Stack } from "react-bootstrap";
import { currencyFormatter } from "./utils";
import '../styles/budget.css';

export default function BudgetCard({ name, amount, max, grey }) {
    const classNames = []
    if (amount > max) {
        classNames.push("bg-danger", "bg-opacity-10")
    } else if (grey) {
        classNames.push("bg-light")
    }

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