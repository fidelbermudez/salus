import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components/navbar.css';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import { BudgetsProvider } from './contexts/BudgetsContext';
import axios from 'axios';
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
    const { isLoggedIn, isLoading } = useAuth();

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
