import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './components/navbar.css';
import reportWebVitals from './reportWebVitals';
import Navbar from './components/navbar.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Budget from './pages/budget';
import Transaction from './pages/transaction';
import User from './pages/user';
import Savings from './pages/savings';
import Summary from './pages/summary';
import Login from './pages/login';
import { AuthProvider, useAuth } from './AuthContext'; 

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className='index'>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route 
          path="/budget" 
          element={isLoggedIn ? <Budget /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/transactions" 
          element={isLoggedIn ? <Transaction /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/user" 
          element={isLoggedIn ? <User /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/savings" 
          element={isLoggedIn ? <Savings /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/summary" 
          element={isLoggedIn ? <Summary /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
