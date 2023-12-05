import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import * as d3 from "d3";

const BarChart = ({year, setMonth, setActive, setLimit, setExpenses, setYear}) => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const userId = localStorage?.userId;
  const svgRef = useRef(null); // Move the useRef here
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [change, setChange] = useState(false);
  const [error, setError] = useState(null);

  const monthNums = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'June': 6,
    'July': 7, 'Aug': 8, 'Sept': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };

  // Define the processData function to process data and create an array of objects
  const processData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
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

    svg.attr("viewBox", `0 0 960 550`);
    svg.attr("preserveAspectRatio", "xMinYMin meet");

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
      setMonth(monthNums[d.srcElement.__data__.name]);
      setYear(year);
      setActive(true);
      setLimit(d.srcElement.__data__.value);
      setExpenses(d.srcElement.__data__.fill);
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
      .call(d3.axisLeft(y).tickFormat(function(d) {
        if (d >= 1e3) {
          return d3.format("$.2s")(d).replace('G', 'B'); // Using B instead of G for billions
        }
        return d3.format("$,.0f")(d);
      }));

    // Create a legend/key for the blue fill
    svg
    .append("rect")
    .attr("x", 220) // Adjust the x-position
    .attr("y", height + 55) // Adjust the y-position
    .attr("width", 20)
    .attr("height", 10)
    .style("fill", "#2ca02c");

    svg
    .append("text")
    .attr("x", 250) // Adjust the x-position
    .attr("y", height + 60) // Adjust the y-position
    .text("Amount Under Limit") // Change "Fill" to "Expenses"
    .style("font-size", "16px")
    .style("alignment-baseline", "middle");


    svg
    .append("rect")
    .attr("x", 60) // Adjust the x-position
    .attr("y", height + 55) // Adjust the y-position
    .attr("width", 20)
    .attr("height", 10)
    .style("fill", "black");
    
    svg
    .append("text")
    .attr("x", 90) // Adjust the x-position
    .attr("y", height + 60) // Adjust the y-position
    .text("Total Expenses") // Change "Fill" to "Expenses"
    .style("font-size", "16px")
    .style("alignment-baseline", "middle");

    svg
    .append("rect")
    .attr("x", 420) // Adjust the x-position
    .attr("y", height + 55) // Adjust the y-position
    .attr("width", 20)
    .attr("height", 10)
    .style("fill", "red");

    svg
    .append("text")
    .attr("x", 450) // Adjust the x-position
    .attr("y", height + 60) // Adjust the y-position
    .text("Amount Over Limit") // Change "Fill" to "Expenses"
    .style("font-size", "16px")
    .style("alignment-baseline", "middle");

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add X axis label
    svg
    .append("text")
    .attr("transform", `translate(${width / 2},${height + margin.top + 20})`) // Adjust position as needed
    .style("text-anchor", "middle")
    .text("Month");

    // Add Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 6)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount");

  }, [categoryInfo, change]);

  return (
      <svg ref={svgRef} width="700" height="400">
      </svg>
  );
};

export default BarChart;