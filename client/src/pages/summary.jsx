import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarGraph from '../components/barGraph.jsx'; // Import the 3D bar graph component
import { useAuth } from '../AuthContext'; 


function Summary() {

const { currentUser } = useAuth(); 
const userId = currentUser?.userId;
const token = localStorage.getItem('authToken');
axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  // const [userId, setUserId] = useState(4);
  const [budgetInfo, setBudgetInfo] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch budget and category data for the user
        const budgetResponse = await axios.get(`http://localhost:8081/api/budgetSummary/user/${userId}`);
        const categoryResponse = await axios.get(`http://localhost:8081/api/category/user/${userId}`);
        
        setBudgetInfo(budgetResponse.data);
        setCategoryInfo(categoryResponse.data);
      } catch (e) {
        setError(e.message || 'Failed to fetch data');
        console.error(e);
      }
    };

    fetchData();
  }, [userId]);

  // Function to process data and create the array of objects
  const processData = () => {
    // Create a map to store the aggregated data
    let dataMap = new Map()
    let categoryMap = new Map()
    // Process budget data
    categoryInfo.forEach((category) => {
      const key = `${category.month}/${category.year}`;

      if (!dataMap.has(key)) {
        dataMap.set(key, {
          name: `${category.month}/${category.year}`,
          value: 0,
          fill: 0,
        });
      }
      if (!categoryMap.has(category.category_id)) {
        categoryMap.set(category.category_id, new Set([key])); // Create a new Set with the initial 'key'
      } else {
        const existingData = categoryMap.get(category.category_id);
        existingData.add(key); // Add 'key' to the existing Set
      }

    });

    console.log(dataMap)
    console.log(categoryMap)

    // Process category data and merge with existing data
    budgetInfo.forEach((budget) => {
      if (categoryMap.has(budget.category_id)){
        for(const time of categoryMap.get(budget.category_id)){
          if(dataMap.has(time)){
            const existingData = dataMap.get(time);
            existingData.value += budget.limit; // Add 0 for category data if it exists
            existingData.fill += budget.amount_spent; // Add 0 for category data if it exists
          }
        }       
      }
    });
    console.log(dataMap)
    console.log(categoryMap)

    // Convert map values to an array of objects
    const data = Array.from(dataMap.values());
    return data;
  };

  let data = processData()
  console.log(data)
  console.log(budgetInfo)
  console.log(categoryInfo)

  return (
    <div>
      <h1>Welcome to your Summary!</h1>
      {/* Render your data in the desired format */}
      {/* <ul>
        {data.map((item) => (
          <li key={item.name}>
            name: {item.name}, value: {item.value}, fill: {item.fill}
          </li>
        ))}
      </ul> */}
      <br/>
      <h4>Budget History</h4>
      <BarGraph dataMap={data}/>
    </div>
  );
}

export default Summary;
