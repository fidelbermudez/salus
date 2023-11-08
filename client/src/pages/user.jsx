import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import Summary from './summary';
import { local } from 'd3';
import styles from '../styles/user.module.css';

const User = () => {
  const {isLoading: authLoading } = useAuth();
  const userId = localStorage.getItem('userId'); // use getItem for localStorage
  const userName = localStorage.getItem('firstName'); // use getItem for localStorage
  const [bankInfo, setBankInfo] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || authLoading) {
    return <div className={styles.centered}><p className={styles.message}>Loading...</p></div>;
  }  

  if (error) {
    return <div className={styles.centered}><p className={styles.message}>Loading...</p></div>;
  } 

  return (
    <div className={styles.centered}>
      <div className={styles.userContainer}>
        <h2>Welcome {userName}!</h2>
        <div className={styles.userInformation}>
          <p><span className={styles.label}>Name:</span> <span className={styles.value}>{localStorage.firstName} {localStorage.lastName}</span></p>
          <p><span className={styles.label}>Email:</span> <span className={styles.value}>{localStorage.email}</span></p>
          <p><span className={styles.label}>Phone Number:</span> <span className={styles.value}>{localStorage.phone_number}</span></p>
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
