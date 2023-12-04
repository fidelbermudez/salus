import React, { useState, useRef, useEffect } from 'react';
import './navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');

    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleNavLinkClick = () => {
    setShowDropdown(false);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav className='nav'>
      <div className="nav-section left">
          <NavLink to="/user" className="app-name">Salus</NavLink>
          <NavLink to="/budget" activeclassname="active">Budget </NavLink>
          <NavLink to="/transactions" activeclassname="active">Transactions</NavLink>
          <NavLink to="/savings" activeclassname="active">Savings</NavLink>
      </div>
      <div className='nav-section right'>
        <div className='user-dropdown' ref={dropdownRef}>
          <button className='nav-icon' onClick={toggleDropdown}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
          </button>
          {showDropdown && (
            <div className='dropdown-content'>
              <NavLink to='/user' onClick={handleNavLinkClick}>Profile</NavLink>
              <NavLink to='/help' onClick={handleNavLinkClick}>Help</NavLink>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className='nav-icon logout'>Logout</button>
      </div>
    </nav>
  );
}
