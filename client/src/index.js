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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className='index'>
        <Navbar />
        <Routes>

          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();



// function App() {
//   let page;
//   switch (window.location.pathname) {
//     default:
//     case "/":
//       page = <Home />;
//       break;
//     case "/budget":
//       page = <Budget />;
//       break;
//     case "/transactions":
//       page = <Transaction />;
//       break;
//     case "/user":
//       page = <User />;
//       break;
//     case "/savings":
//       page = <Saving />;
//       break;
//     case "/summary":
//       page = <Summary />;
//       break;
//     case "/login":
//       page = <Login />;
//       break;
//   }

//   return (
//     <div className="App">
//       <Navbar />
//       <div className="container">
//         {page}
//       </div>
//     </div>
//   );
// }

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// reportWebVitals();
