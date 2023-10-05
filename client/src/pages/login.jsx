import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import styles from"../styles/login.module.css"

const Login = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
        if (response.status === 200) {
            const userData = await response.json();
            setCurrentUser(userData); 
            navigate("/user");
      } else {
            const data = await response.json();
            alert(data.message);
      }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.loginPage}>
        <h2 className={styles.h2}>Log In or Sign Up!</h2>
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    </div>
);
};  

export default Login;