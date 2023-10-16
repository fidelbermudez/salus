import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 

const User = () => {
  const { currentUser } = useAuth(); 
  const userId = currentUser?.userId;
  const [bankInfo, setBankInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        if (userId === undefined || isNaN(userId)) {
          throw new Error("Invalid user ID");
        }

        const response = await axios.get(`http://localhost:8081/api/bank/${userId}/bankInfo`);

        setBankInfo(response.data);
      } catch (e) {
        setError(e.message || 'Failed to fetch bank info');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBankInfo();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Welcome!</h2>
      {bankInfo && (
        <div>
          <h3>Bank Information</h3>
          <p>Account Number: {bankInfo.account_id}</p>
          <p>Account Type: {bankInfo.accountType}</p>
          <p>Bank Name: {bankInfo.bankName}</p>
          {/* Display other bank info here */}
        </div>
      )}
    </div>
  );
};

export default User;
