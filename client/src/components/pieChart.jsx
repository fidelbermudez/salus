import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import * as d3 from "d3";

const PieChart = ({active, month, year }) => {
    const { currentUser, isLoading: authLoading } = useAuth();
    const userId = localStorage?.userId;
    const [categoryInfo, setCategoryInfo] = useState([]);
    const svgRef = useRef(null);

    const months = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
    "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12}

    useEffect(() => {
        if (authLoading) return;
    
        const token = localStorage.getItem('authToken');
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    
        const fetchData = async () => {
          try {
            if(month != null){
                const categoryResponse = await axios.get(`http://localhost:8081/api/category/user/${userId}/${year}/${months[month]}`);
                setCategoryInfo(categoryResponse.data);
                console.log(categoryResponse.data);
            }
          } catch (e) {
            if (e.response && e.response.status === 404) {
              setCategoryInfo([]);
            } else {
              console.error(e);
            }
          }
        return
        };
        fetchData();
      }, [userId, authLoading, month]);


    return (
      <div>
        {active ? <h1>{month}, {year} Expenses</h1> : <h1>Click to See Monthly Breakdown</h1>}
      </div>
    );
}

export default PieChart;