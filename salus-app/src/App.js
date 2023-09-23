import React from 'react';
//import {Route, Routes} from 'react-router-dom';
import Navbar from "./components/Navbar";
import User from "./pages/User";
import Transactions from "./pages/Transactions.js";
import Budget from "./pages/Budget";
import Home from "./pages/Home";
import Savings from "./pages/Savings"
import Summary from "./pages/Summary"
import Login from "./pages/Login"
import "./App.css";


function App() {
  let page
  switch (window.location.pathname){
    default:
      page = <Home />
      break
    case "/":
      page = <Home />
      break
    case "/budget":
      page = <Budget />
      break
    case "/transactions":
      page = <Transactions />
      break
    case "/user":
      page = <User />
      break
    case "/savings":
      page = <Savings />
      break
    case "/summary":
      page = <Summary/>
      break
    case "/login":
      page = <Login />
  }

  return (
    <div>
    <Navbar />
      <div className = "container">
      {page}
      </div>
    </div>
  )
}
export default App


// how it would be done with routing:

// function App() {
//   return (
//     <div>
//       <Navbar />
//       <div className="container">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/budget" element={<Budget />} />
//           <Route path="/transactions" element={<Transactions />} />
//           <Route path="/user" element={<User />} />
//         </Routes>
//       </div>
//     </div>
//   )
// }
// export default App