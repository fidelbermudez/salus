import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import styles from "../styles/login.module.css"
import { Link } from 'react-router-dom';

const Login = () => {
  const { setCurrentUser, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '', 
    last_name: '',    
    phone_number: '' 
  });

  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8081/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.status === 201) { 
        const userData = await response.json();
        localStorage.setItem("userId", userData.userId); // assuming the data has a userId property
        localStorage.setItem('authToken', userData.token); // and a token
        login(userData);
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
  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    }); 
  };

  const handleLogin = async (e) =>  {
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
        localStorage.setItem("userId", userData.userId); // assuming the data has a userId property
        localStorage.setItem('authToken', userData.token); // and a token
        login(userData);  
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
        <Link to="/">
            <h2 className={styles.h2}>Salus</h2>
        </Link>

        <div className={styles.loginContainer}>
            {authLoading ? (
                <p>Loading...</p> // Display a loading message when auth data is loading
            ) : isSignUpMode ? (
                <>
                    <h3>Sign up</h3>
                    <form>
                        <div>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
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
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phone_number" // Fixed the name attribute
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="button" className={styles.button} onClick={handleSignUp} disabled={authLoading}>Sign up</button>
                    </form>
                    <div className={styles.newSalus}>
                        <p>Already have an account? <a href="#" onClick={toggleMode}>Sign in</a></p>
                    </div>
                </>
            ) : (
                <>
                    <h3>Sign in</h3>
                    <p>Stay updated on your professional world</p>
                    <form>
                        <div>
                            <label htmlFor="email">Email</label>
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
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="button" className={styles.button} onClick={handleLogin} disabled={authLoading}>Sign in</button>
                    </form>
                    <div className={styles.newSalus}>
                        <p>New to Salus? <a href="#" onClick={toggleMode}>Join now</a></p>
                    </div>
                </>
            )}
        </div>
    </div>
);
};
export default Login;