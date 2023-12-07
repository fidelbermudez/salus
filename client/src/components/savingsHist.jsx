import React from 'react';
import '../styles/savings.css'
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import {useState, useEffect} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';


function SavingsHist(props) {
// category ID, category name, user id
  const { show, onHide, name, userID, creation_date } = props;
  const handleClose = () => {
    props.onHide(); // Close the modal using the onHide prop from props
  };

  const [history, setHistory] = useState([]);
  const [sortedHist, setSortedHist] = useState([]);
  const [sorted, setSorted] = useState(false);



  useEffect(() => {
    // axios.get(`http://localhost:8081/api/savingsHistory/show/${userID}/${name}`)
    // .then(history => setHistory(history.data.sort((a, b) => new Date(b.date) - new Date(a.date))))
    // .catch(err => console.log(err))

    const displayHist = async () => {
      const safeDate = encodeURIComponent(creation_date);
      console.log(safeDate);
        try {
            // const data = {c_date: creation_date};
            // const response = await axios.get(`http://localhost:8081/api/savingsHistory/show/${userID}/${name}`, data);
            const response = await axios.get(`http://localhost:8081/api/savingsHistory/show/${userID}/${name}/${safeDate}`);
            // const sortedHist = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            const sortedHist = response.data.sort((a, b) => {
              const dateComparison = new Date(b.date) - new Date(a.date);

              // If dates are equal, use timestamp for comparison
              if (dateComparison === 0) {
                return b.timestamp.localeCompare(a.timestamp); // Sort timestamps in ascending order
              }

              return dateComparison;
            });
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
        setSortedHist(sortedHistByDate);
        setSorted(true);
        console.log(history)
    };

    const sortHistByDateDescending = () => {
        const sortedHistByDateDescending = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        setSortedHist(sortedHistByDateDescending);
        setSorted(true);
    };

    const sortHistByAmount = () => {
        const sortedHistByAmount = [...history].sort((a, b) => a.amount - b.amount);
        setSortedHist(sortedHistByAmount);
        setSorted(true);
    };
    const sortHistByAmountDescending = () => {
        const sortedHistByAmountDescending = [...history].sort((a, b) => b.amount - a.amount);
        setSortedHist(sortedHistByAmountDescending);
        setSorted(true);
    };

  const [startSearchDate, setStartSearchDate] = useState('');
  const [endSearchDate, setEndSearchDate] = useState('');
  const [searchRange, setSearchRange] = useState([]);
  const [limit, setLimit] = useState(false);

  const filterHistoryByDateRange = () => {
    let filteredHistory = [...history];

    if (startSearchDate) {
      // Filter data with date after or equal to startSearchDate
      filteredHistory = filteredHistory.filter(item => new Date(item.date) >= new Date(startSearchDate));
    }

    if (endSearchDate) {
      // Filter data with date before or equal to endSearchDate
      filteredHistory = filteredHistory.filter(item => new Date(item.date) <= new Date(endSearchDate));
    }

    // Now filteredHistory contains the data within the specified date range
    setSearchRange(filteredHistory);
  };


  const handleStartDateChange = (e) => {
    setStartSearchDate(e.target.value);
    filterHistoryByDateRange();
    setLimit(true);
  };
  const handleEndDateChange = (e) => {
    setEndSearchDate(e.target.value);
    filterHistoryByDateRange();
    setLimit(true);
  };

  const [sortedRange, setSortedRange] = useState([]);
  const [sorted2, setSorted2] = useState(false);

  const sortRangeByDate = () => {
        console.log("sorting range by date");
        console.log("limit value is ", limit);
        const sortedRangeByDate = [...searchRange].sort((a, b) => new Date(a.date) - new Date(b.date));
        setSortedRange(sortedRangeByDate);
        setSorted2(true);
    };

    const sortRangeByDateDescending = () => {
        const sortedRangeByDateDescending = [...searchRange].sort((a, b) => new Date(b.date) - new Date(a.date));
        setSortedRange(sortedRangeByDateDescending);
        setSorted2(true);
    };

    const sortRangeByAmount = () => {
        const sortedRangeByAmount = [...searchRange].sort((a, b) => a.amount - b.amount);
        setSortedRange(sortedRangeByAmount);
        setSorted2(true);
    };
    const sortRangeByAmountDescending = () => {
        const sortedRangeByAmountDescending = [...searchRange].sort((a, b) => b.amount - a.amount);
        setSortedRange(sortedRangeByAmountDescending);
        setSorted2(true);
    };

  
  const handleClear = () => {
        setLimit(false);
        setStartSearchDate('');
        setEndSearchDate('');
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

        <div className="search-hist">
          <div className="date-input-container">
          <label htmlFor="startDate" className="date-label">Start Date</label>
          <input
            type="date"
            placeholder="Start Date"
            value={startSearchDate}
            onChange={handleStartDateChange}
          />
          </div>
          <div className="date-input-container">
          <label htmlFor="endDate" className="date-label">End Date</label>
          <input
            type="date"
            placeholder="End Date"
            value={endSearchDate}
            onChange={handleEndDateChange}
          />
          </div>
          <Button onClick={handleClear} > Clear </Button>
        </div>
        <div id="histTableContainer">
            {limit ? (
              <table className = "histTable">
              <thead className="histTable-head">
                  <tr>
                  <th>Date
                      <button className = "headButton" id="sortHist" onClick={sortRangeByDate}>↑</button>
                      <button className = "headButton" id="sortHist" onClick={sortRangeByDateDescending}>↓</button>
                  </th>
                  <th>Amount
                      <button className = "headButton" id="sortHist" onClick={sortRangeByAmount}>↑</button>
                      <button className = "headButton" id="sortHist" onClick={sortRangeByAmountDescending}>↓</button>
                  </th>
                  </tr>
              </thead>
              <tbody>
              {sorted2 ? (
                  sortedRange.map(entry => {
                  // console.log("here, limit is ", limit);
                  return <tr key={entry._id}>
                      <td>{entry.date}</td>
                      <td id="posamount"> {entry.amount >= 0 ? "$" + entry.amount : "-$" + entry.amount * -1}</td>
                      </tr>
                  })
                ) : (
                  searchRange.map(entry => {
                      return <tr key={entry._id}>
                      <td>{entry.date}</td>
                      <td id="posamount"> {entry.amount >= 0 ? "$" + entry.amount : "-$" + entry.amount * -1} </td>
                      </tr>
                  }))
                }
              </tbody>
              </table>
              ): 
            <table className = "histTable">
            <thead className="histTable-head">
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
             {sorted ? (
                sortedHist.map(entry => (
                  <tr key={entry._id}>
                    <td>{entry.date}</td>
                    <td id="posamount"> ${entry.amount}</td>
                    </tr>
                ))
              ) : (
                history.map(entry => {
                    return <tr key={entry._id}>
                    <td>{entry.date}</td>
                    <td id="posamount"> {entry.amount >= 0 ? "$" + entry.amount : "-$" + entry.amount * -1} </td>
                    </tr>
                }))
              }
            </tbody>
            </table>
            }
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SavingsHist;
