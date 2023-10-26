import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import styles from "../styles/login.module.css"
import { Link } from 'react-router-dom';

const Login = () => {
  const { setCurrentUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/user");
    }
  }, [isLoggedIn]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
                localStorage.setItem('authToken', userData.token);
                setCurrentUser(userData); 
                console.log(userData)
                navigate("/user")
           } else {
                const data = await response.json();
                alert(data.message);
          }
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
      };

  //todo!! make user be able to register
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/api/users/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const userData = await response.json();
        localStorage.setItem('authToken', userData.token);
        setCurrentUser(userData); 
        navigate("/user");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
        console.error(error);
        alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className={styles.loginPage}>
        <Link to="/">
          <h2 className={styles.h2}>Salus</h2>
        </Link>
        
        <div className={styles.loginContainer}>
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
                <button type="button" className={styles.button} onClick={handleLogin}>Sign in</button>
            </form>
            <div className={styles.newSalus}>
                <p>New to Salus? <a href="#">Join now</a></p>
            </div>
        </div>
    </div>
  );
};

export default Login;