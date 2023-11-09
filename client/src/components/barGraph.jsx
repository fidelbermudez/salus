import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import * as d3 from "d3";

const BarChart = ({year, setMonth, setActive}) => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const userId = localStorage?.userId;
  const svgRef = useRef(null); // Move the useRef here
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [change, setChange] = useState(false);
  const [error, setError] = useState(null);

  // Define the processData function to process data and create an array of objects
  const processData = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    let dataMap = new Map();
  
    // Initialize dataMap with all months
    months.forEach((month) => {
      dataMap.set(month, {
        name: month,
        value: 0,  // Initialize value and fill to 0
        fill: 0,
      });
    });
  
    // Update dataMap with data from categoryInfo
    categoryInfo.forEach((category) => {
      const key = `${months[category.month - 1]}`;
      if (dataMap.has(key)) {
        const existingData = dataMap.get(key);
        existingData.value += category.limit;
        existingData.fill += category.amount_spent;
      }
    });
  
    const data = Array.from(dataMap.values());
    return data;
  };

  useEffect(() => {
    if (authLoading) return;

    const token = localStorage.getItem('authToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(`http://localhost:8081/api/category/user/${userId}/${year}`);
        setCategoryInfo(categoryResponse.data);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          setCategoryInfo([]);
        } else {
          console.error(e);
        }
      }
    setChange(true);
    return
    };
    fetchData();
  }, [userId, authLoading]);

  useEffect(() => {
    if (!svgRef.current || change == false) {
      return;
    }
    const dataMap = processData();

    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([margin.left, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // Find the maximum value in your data
    const maxDataValue = d3.max(dataMap, function (d) {
      return d.value + d.fill;
    });

    // Set a default maximum value of 1000 when the maximum data value is 0
    if (maxDataValue === 0) {
      y.domain([0, 1000]);
    } else {
      y.domain([
        0,
        d3.max(dataMap, function (d) {
          return d.value + d.fill;
        }),
      ]);
    }

    const svg = d3.select(svgRef.current);

    x.domain(
      dataMap.map(function (d) {
        return d.name;
      })
    );

    // Create a custom number format function to add the dollar sign
    const dollarFormat = d3.format("$,.0f");

    const handleBarClick = (d) => {
      // d contains the data associated with the clicked bar
      // You can add your custom behavior here
      setMonth(d.srcElement.__data__.name);
      setActive(true);
    };

    // Draw the main bars
    svg
      .selectAll(".bar")
      .data(dataMap)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.name);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .on("click", handleBarClick)
      .style("fill", "#2ca02c")
      .style("stroke", "black")  // Set the border color to black
      .style("stroke-width", 2)  // Set the border width
      .style("cursor", "pointer");

    // Adding the fill bars
    svg
      .selectAll(".fill")
      .data(dataMap)
      .enter()
      .append("rect")
      .attr("class", "fill")
      .attr("x", function (d) {
        return x(d.name);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.fill);
      })
      .attr("height", function (d) {
        return height - y(d.fill);
      })
      .on("click", handleBarClick)
      .style("fill", "black")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .style("cursor", "pointer");


      // Bars exceeding the limit (display in red)
      svg
      .selectAll(".fill2")
      .data(dataMap)
      .enter()
      .append("rect")
      .attr("class", "fill2")
      .attr("x", function (d) {
        return x(d.name);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        if(d.value < d.fill){
        return y(Math.max(d.value, d.fill));
        }
      })
      .attr("height", function (d) {
        if(d.value < d.fill){        
          return height - y(d.fill - d.value);
        }
      })
      .on("click", handleBarClick)    
      .style("fill", "red")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .style("cursor", "pointer");
      

    // Add the left-axis scale with the custom number format
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + margin.left + ",0)") // Adjust the x-position
      .call(d3.axisLeft(y).tickFormat(dollarFormat));

    // Create a legend/key for the blue fill
    svg
    .append("rect")
    .attr("x", 220) // Adjust the x-position
    .attr("y", height + 20) // Adjust the y-position
    .attr("width", 20)
    .attr("height", 10)
    .style("fill", "black");

    svg
    .append("text")
    .attr("x", 150) // Adjust the x-position
    .attr("y", height + 30) // Adjust the y-position
    .text("Total Expenses") // Change "Fill" to "Expenses"
    .style("font-size", "12px")
    .style("alignment-baseline", "middle");


    svg
    .append("rect")
    .attr("x", 20) // Adjust the x-position
    .attr("y", height + 20) // Adjust the y-position
    .attr("width", 20)
    .attr("height", 10)
    .style("fill", "#2ca02c");
    
    svg
    .append("text")
    .attr("x", 50) // Adjust the x-position
    .attr("y", height + 30) // Adjust the y-position
    .text("Limit") // Change "Fill" to "Expenses"
    .style("font-size", "12px")
    .style("alignment-baseline", "middle");

    svg
    .append("rect")
    .attr("x", 320) // Adjust the x-position
    .attr("y", height + 20) // Adjust the y-position
    .attr("width", 20)
    .attr("height", 10)
    .style("fill", "red");

    svg
    .append("text")
    .attr("x", 350) // Adjust the x-position
    .attr("y", height + 30) // Adjust the y-position
    .text("Expenses Over Limit") // Change "Fill" to "Expenses"
    .style("font-size", "12px")
    .style("alignment-baseline", "middle");

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


  }, [categoryInfo, change]);

  return (
    <div className="bar-chart">
      <svg ref={svgRef} width="960" height="550">
        {/* Render the bar chart inside this SVG container */}
      </svg>
    </div>
  );
};

export default BarChart;