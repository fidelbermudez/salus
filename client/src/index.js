import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './components/navbar.css';
import reportWebVitals from './reportWebVitals';
import Navbar from './components/navbar.jsx';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Budget from './pages/budget';
import Transaction from './pages/transaction';
import User from './pages/user';
import Saving from './pages/savings';
import Summary from './pages/summary';
import Login from './pages/login';
import { AuthProvider } from './AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider> 
      <BrowserRouter>
        <div className='index'>
          <Navbar />
          <Routes>
            <Route path='*' element={<Navigate to="/" />} />
            <Route path='/budget' element={<Budget />} />
            <Route path='/transactions' element={<Transaction/>} />
            <Route path='/user' element={<User/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/savings' element={<Saving/>} />
            <Route path='/summary' element={<Summary/>} />
            <Route path='/home' element={<Home/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
