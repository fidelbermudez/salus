import React, { useState, useEffect } from 'react'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const AddBankAccountModal = ({
  show, 
  handleClose, 
  handleSubmit, 
  accountDetails, 
  setAccountDetails, 
  banks,
  accountTypes
}) => {
  const [inlineAlert, setInlineAlert] = useState({ show: false, message: '' });
  const handleChange = (e) => {
    setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
  };

  const displayErrorAlert = (message) => {
    setInlineAlert({ show: true, message });

    // Set a timer to automatically hide the alert after 3 seconds
    const timer = setTimeout(() => {
      setInlineAlert({ show: false, message: '' });
    }, 3500);

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  };
  

  const handleSave = async (event) => {
    event.preventDefault();
  
    // Check for a valid 6-digit account ID
    if (accountDetails.account_id.length !== 6) {
      displayErrorAlert("Please enter a valid 6-digit account ID");
      return;
    }
  
    // Check if "Select Bank" is chosen or bank name is not selected
    if (!accountDetails.bankName || accountDetails.bankName === "Select Bank") {
      displayErrorAlert("Please select a valid bank name");
      return;
    }
  
    // Check if "Select Account Type" is chosen or account type is not selected
    if (!accountDetails.accountType || accountDetails.accountType === "Select Account Type") {
      displayErrorAlert("Please select a valid account type");
      return;
    }
  
    // Simulate a successful submission
    try {
        // Await the handleSubmit function
        const response = await handleSubmit(accountDetails);
        console.log(response);
    
        // Assuming the response contains a status indicating success
        if (response && response.status === 201) {
          setInlineAlert({
            show: true,
            message: "Account added successfully!",
            variant: "success"
          });
    
          // Other success actions...
          setTimeout(() => {
            setInlineAlert({ show: false, message: '' }); // Hide the alert
            handleClose(); // Close the modal
          }, 3000); // Adjust the time as needed
        }else if (response && response.status === 400){
            setInlineAlert({
                show: true,
                message: "Account already exists!",
                variant: "danger"
            });
        
            // Other success actions...
            setTimeout(() => {
                setInlineAlert({ show: false, message: '' }); // Hide the alert
                handleClose(); // Close the modal
            }, 3000); // Adjust the time as needed
        }else {
          // Handle other cases or unexpected responses
          displayErrorAlert('Unexpected response from the server.');
        }
        } catch (error) {
            // Handle errors
            console.error("Axios error:", error.response); // Log the error response from Axios
            displayErrorAlert(error.response?.data?.message || "Failed to add account");
        }
        };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Bank Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {inlineAlert.show && (
        <Alert variant={inlineAlert.variant || "danger"} onClose={() => setInlineAlert({ show: false, message: '' })} dismissible>
            {inlineAlert.message}
        </Alert>
        )}
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label htmlFor="account_id" className="form-label">Account ID</label>
            <input
              type="text"
              className="form-control"
              id="account_id"
              name="account_id"
              value={accountDetails.account_id}
              onChange={handleChange}
              placeholder="Account ID (6 digits)"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="bankName" className="form-label">Bank Name</label>
            <select
              className="form-select"
              id="bankName"
              name="bankName"
              value={accountDetails.bankName}
              contentEditable={true}
              onChange={handleChange}
              
            >
              {banks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="accountType" className="form-label">Account Type</label>
            <select
              className="form-select"
              id="accountType"
              name="accountType"
              value={accountDetails.accountType}
              onChange={handleChange}
              
            >
              {accountTypes.map(type => (   
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Account
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBankAccountModal;
