import './navbar.css';
import { NavLink} from "react-router-dom";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");

    logout();
    navigate("/login");
};
  if (!isLoggedIn) {
    return null; 
  }
  return (
    <nav className="nav">
      <NavLink to="/" className="app-name">S</NavLink>
      <ul>
        <NavLink to="/budget">Budget</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/savings">Savings</NavLink>
        {
          isLoggedIn ? (
            <>
              <NavLink to="/user">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
              </NavLink>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )
        }
      </ul>
    </nav>
  );
}
