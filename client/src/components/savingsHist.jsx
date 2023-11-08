import React from 'react';
import '../styles/savings.css'
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import {useState, useEffect} from 'react';
import axios from 'axios';


function SavingsHist(props) {
// category ID, category name, user id
  const { show, onHide, catID, name, userID } = props;
  const handleClose = () => {
    props.onHide(); // Close the modal using the onHide prop from props
  };

  const[history, setHistory] = useState([]);


  useEffect(() => {
    // axios.get(`http://localhost:8081/api/savingsHistory/show/${userID}/${name}`)
    // .then(history => setHistory(history.data.sort((a, b) => new Date(b.date) - new Date(a.date))))
    // .catch(err => console.log(err))

    const displayHist = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/savingsHistory/show/${userID}/${name}`);
            const sortedHist = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setHistory(sortedHist);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    }
    displayHist();
    });

    const sortHistByDate = () => {
        const sortedHistByDate = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log(history);
        setHistory(sortedHistByDate);
        console.log(history)
    };

    const sortHistByDateDescending = () => {
        const sortedHistByDateDescending = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sortedHistByDateDescending);
    };

    const sortHistByAmount = () => {
        const sortedHistByAmount = [...history].sort((a, b) => a.amount - b.amount);
        setHistory(sortedHistByAmount);
    };
    const sortHistByAmountDescending = () => {
        const sortedHistByAmountDescending = [...history].sort((a, b) => b.amount - a.amount);
        setHistory(sortedHistByAmountDescending);
    };

 

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className = "modal"
      id = "hist-modal"
    >
    <Modal.Header id="hist-header">
      <Modal.Title id="contained-modal-title-vcenter">
          {name} - Goal History
        </Modal.Title>
      <CloseButton className="btn-close-white" onClick = {handleClose} style={{ color: 'white !important' }} />
      </Modal.Header>
      <Modal.Body id="hist-body">
        <div id="histTableContainer">
            <table className = "histTable">
            <thead>
                <tr>
                <th>Date
                    <button className = "headButton" id="sortHist" onClick={sortHistByDate}>↑</button>
                    <button className = "headButton" id="sortHist" onClick={sortHistByDateDescending}>↓</button>
                </th>
                <th>Amount
                    <button className = "headButton" id="sortHist" onClick={sortHistByAmount}>↑</button>
                    <button className = "headButton" id="sortHist" onClick={sortHistByAmountDescending}>↓</button>
                </th>
                </tr>
            </thead>
            <tbody>
                {
                history.map(entry => {
                    return <tr key={entry._id}>
                    <td>{entry.date}</td>
                    <td id="posamount"> ${entry.amount}</td>
                    </tr>
                })
                }
            </tbody>
            </table>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SavingsHist;
