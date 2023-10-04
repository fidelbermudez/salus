import './navbar.css';
//import { Link, useMatch, useResolvedPath } from "react-router-dom"
import React from 'react';
import { NavLink } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="nav">
      <a href="/" className="app-name">
        S
      </a>
      <ul>
        <a href="/budget">Budget</a>
        <a href="/transactions">Transactions</a>
        <a href="/savings">Savings</a>
        <a href="/login">Login</a>
      </ul>
    </nav>
  )
}

