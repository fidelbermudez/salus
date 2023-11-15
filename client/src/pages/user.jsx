import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import Summary from './summary';
import { local } from 'd3';
import styles from '../styles/user.module.css';
import Alert from 'react-bootstrap/Alert';


const User = () => {
  const {isLoading: authLoading } = useAuth();
  const userId = localStorage.getItem('userId'); // use getItem for localStorage
  const userName = localStorage.getItem('firstName'); // use getItem for localStorage
  const [bankInfo, setBankInfo] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState(localStorage.getItem('email') || '');
  const [newPhoneNumber, setNewPhoneNumber] = useState(localStorage.getItem('phone_number') || '');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const displayErrorAlert = (message) => {
    setErrorAlertMessage(message);
    setShowErrorAlert(true);
    setTimeout(() => { 
      setShowErrorAlert(false);
    }, 2000);
  };
  const displaySuccessAlert = (message) => {
    setSuccessAlertMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => { 
      setShowSuccessAlert(false);
    }, 2000); // Automatically hide the alert after 2 seconds
  };
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const phoneNumberIsValid = (phoneNumber) => {
    return /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
  };
  
  
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!userId || isNaN(userId)) {
      setError("Invalid user ID");
      setLoading(false);
      return; 
    }
    
    const fetchBankInfo = async () => {
      try {
        const token = localStorage.getItem('authToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`http://localhost:8081/api/bank/${userId}/bankInfo`);
      
        setBankInfo(Array.isArray(response.data) ? response.data : [response.data]); // Ensure bankInfo is always an array
        
      } catch (e) {
        setError(e.message || 'Failed to fetch bank info');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBankInfo();
  }, [userId, authLoading]);
  const EditButton = () => {
    return (
      <button onClick={() => {
        setIsEditing(true);
        setNewPassword('');
        setConfirmPassword('');
      }} 
      className={styles.iconButton}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1C3879" class="bi bi-pencil" viewBox="0 0 16 16">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
        </svg>
      </button>
    );
  };
  const handleEditClick = () => {
    setIsEditing(true);
    setNewPassword('');
    setConfirmPassword('');
  };


  const handleSave = async () => {
    // Validate inputs
    if (!emailIsValid(newEmail) || !phoneNumberIsValid(newPhoneNumber)) {
      displayErrorAlert('Please enter valid email and phone number.');
      return;
    }
  
    if (newPassword && newPassword !== confirmPassword) {
      displayErrorAlert('New passwords do not match.');
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
      // Update email and phone number
      await axios.patch(`http://localhost:8081/api/users/updateEmail/${userId}`, { email: newEmail });
      await axios.patch(`http://localhost:8081/api/users/updatePhoneNumber/${userId}`, { phone_number: newPhoneNumber });
      localStorage.setItem('email', newEmail);
      localStorage.setItem('phone_number', newPhoneNumber);
  
      // Update password if a new one is provided
      if (newPassword) {
        await axios.patch(`http://localhost:8081/api/users/updatePassword/${userId}`, {
          newPassword
        });
      }
  
      displaySuccessAlert('Information updated successfully');
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      displayErrorAlert(error.response?.data?.message || 'Failed to update information');
    }
  };
  
  
  

  if (loading || authLoading) {
    return <div className={styles.centered}><p className={styles.message}>Loading...</p></div>;
  }  

  if (error) {
    return <div className={styles.centered}><p className={styles.message}>Loading...</p></div>;
  } 

  return (
    <div className={styles.centered}>
      <div className={styles.userContainer}>
        {/* Success and Error Alerts */}
        {showSuccessAlert && (
          <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
            {successAlertMessage}
          </Alert>
        )}
        {showErrorAlert && (
          <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
            {errorAlertMessage}
          </Alert>
        )}
        <h2>Welcome {userName}!</h2>
  
        <div className={styles.userInformation}>
          <p><span className={styles.label}>Name:</span> <span className={styles.value}>{localStorage.firstName} {localStorage.lastName}</span></p>
          <p>
            <span className={styles.label}>Email:</span>
            {isEditing ? (
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New Email"
              />
            ) : (
              <span className={styles.value}>{localStorage.email}</span>
            )}
          </p>
          <p>
            <span className={styles.label}>Phone Number:</span>
            {isEditing ? (
              <input
                type="text"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="New Phone Number"
              />
            ) : (
              <span className={styles.value}>{localStorage.phone_number}</span>
            )}
          </p>

          {isEditing ? (
            <>
              <div>
                <p>
                  <span className={styles.label}>New Password:</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                  />
                </p>
                <p>
                  <span className={styles.label}>Confirm New Password:</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                  />
                </p>
              </div>

              <button onClick={handleSave} className={styles.checkButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="green" class="bi bi-check2-circle" viewBox="0 0 16 16">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                  </svg>
                </button>
                <button onClick={() => setIsEditing(false)} className={styles.iconButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="red" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
            </button>
            </>
          ) : (
            <EditButton className={styles.iconButton}/>
          )}
        </div>

  
        {bankInfo.length > 0 && (
          <div className={styles.bankAccountsContainer}>
            <h3 className={styles.bankAccountHeader}>Linked Bank Accounts</h3>
            <ul className={styles.bankAccountsList}>
              {bankInfo.map((account, index) => (
                <li key={index} className={styles.bankAccount}>
                  <p><span className={styles.label}>Bank Name:</span> <span className={styles.value}>{account.bankName}</span></p>
                  <p><span className={styles.label}>Account Type:</span> <span className={styles.value}>{account.accountType}</span></p>
                </li>
              ))}
            </ul>
          </div> 
        )}
      </div>
    </div>
  );
  
};

export default User;
