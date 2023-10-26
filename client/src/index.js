import React, { useContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components/navbar.css';
import Navbar from './components/navbar.jsx';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Budget from './pages/budget';
import Transaction from './pages/transaction';
import User from './pages/user';
import Savings from './pages/savings';
import Summary from './pages/summary';
import Login from './pages/login';
import { AuthProvider, useAuth } from './AuthContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { BudgetsProvider } from './contexts/BudgetsContext';
import axios from 'axios';


function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return children;
  }

  return <Navigate to="/login" replace />;
}
function App() {
  const { isLoggedIn, setCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          const response = await axios.get('http://localhost:8081/api/users/me');

          if (response.status === 200) {
            setCurrentUser(response.data);
          } else {
            console.error('Unexpected status code:', response.status);
            localStorage.removeItem('authToken'); // Clear token if invalid or unexpected status
          }
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          localStorage.removeItem('authToken'); // Clear token if there's an error
        }
      }
      setIsLoading(false);
      setHasCheckedToken(true);
    };

    if (!hasCheckedToken) {
      fetchCurrentUser();
    }
  }, [hasCheckedToken]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='index'>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// reportWebVitals();