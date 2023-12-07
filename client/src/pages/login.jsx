import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import styles from "../styles/login.module.css"
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';


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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [isOtpVerificationMode, setIsOtpVerificationMode] = useState(false);
  const [otp, setOtp] = useState('');


  const displayErrorAlert = (message) => {
    setErrorAlertMessage(message);
    setShowErrorAlert(true);
    setTimeout(() => { 
      setShowErrorAlert(false);
    }, 5000);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    const emailIsValid = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const phoneNumberIsValid = (phoneNumber) => {
      return /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
    };
    if (!phoneNumberIsValid(formData.phone_number)) {
      displayErrorAlert('Phone number must be in the format ###-###-####');
      return;
    }
    
    if (!emailIsValid(formData.email)) {
      displayErrorAlert('Please enter a valid email address.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      displayErrorAlert('Passwords do not match');
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
        setShowSuccessAlert(true);
        // Directly switch to sign-in mode after showing the success message
        setIsSignUpMode(false);
        // Optionally, clear the form or set up the form for sign-in
        setFormData({
          ...formData,
          password: '',
          confirmPassword: ''  // Clear the password fields, assuming you want to keep the email for easier login
        });
        // If you wish to hide the success alert after some time, you can set a timeout to hide it
      }
    } catch (error) {
      console.error(error);
      displayErrorAlert('An error occurred. Please try again.');

    }
  };
  const handleOtpVerification = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8081/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });
  
      if (response.status === 200) {
        // OTP verification successful
        const userData = await response.json();
        localStorage.setItem("userId", userData.userId); // assuming the data has a userId property
        localStorage.setItem('authToken', userData.token); // and a token
        login(userData);  
        navigate("/user");
      } else {
          const data = await response.json();
          displayErrorAlert(data.message);
      }
    } catch (error) {
        console.error(error);
        displayErrorAlert('An error occurred. Please try again.');
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
        setIsOtpVerificationMode(true);
      } else {
        const data = await response.json();
        displayErrorAlert(data.message);
      }
    } catch (error) {
      console.error(error);
      displayErrorAlert('An error occurred. Please try again.');
    }
  };
  const handleOtpChange = (e, index) => {
    const value = e.target.value.slice(0, 1); // Take only the first character
    setOtp(otp => {
      const newOtp = otp.split('');
      newOtp[index] = value;
      return newOtp.join('');
    });
  
    // Move to the next input if the current value is filled
    if (value && index < 5) {
      const nextSibling = document.querySelector(
        `input[name='otp${index + 1}']`
      );
      if (nextSibling) {
        nextSibling.focus();
      }
    }
  };
  
  


  return (
    <div className={styles.loginPage}>
        <Link to="/">
            <h2 className={styles.h2}>Salus</h2>
        </Link>
        {showSuccessAlert && (
          <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
              Account successfully created! You can now sign in.
          </Alert>
        )}
        {showErrorAlert && (
          <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
            {errorAlertMessage}
          </Alert>
        )}
        <div className={styles.loginContainer}>
            {authLoading ? (
                <p>Loading...</p> 
            ) : isOtpVerificationMode ? (
              <form onSubmit={handleOtpVerification} className="otp-form">
                <h3>Enter OTP</h3>
                <div className="otp-inputs d-flex justify-content-center mb-3">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`otp${index}`}
                      className="form-control mx-1 text-center"
                      maxLength="1"
                      onChange={(e) => handleOtpChange(e, index)}
                      value={otp[index] || ''}
                      required
                    />
                  ))}
                </div>
                <div className="d-flex justify-content-center">
                  <button 
                    type="submit" 
                    style={{ backgroundColor: '#5164ba', borderColor: '#5164ba' }} // Inline styles as an object
                    className="btn btn-primary mr-2"
                  >
                    Verify OTP
                  </button>
                </div>

              </form>
            )  : isSignUpMode ? (
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
                              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                              title="Please enter a valid email address."
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
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handleChange}
                              required
                              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                              title="###-###-####"
                              />
                        </div>
                        <button type="button" className={styles.button} onClick={handleSignUp} disabled={authLoading}>Sign up</button>
                    </form>
                    <div className={styles.newSalus}>
                        <p>Already have an account? <button onClick={toggleMode} className={styles.secondaryButton}>Sign in</button></p>                   
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
                        <p>New to Salus? <button onClick={toggleMode} className={styles.secondaryButton}>Join now</button></p>                    
                    </div>
                </>
            )}
        </div>
    </div>
  );
};
export default Login;