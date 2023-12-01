import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from '../AuthContext';
import * as d3 from "d3";

const PieChart = ({ active, month, year, data, limit, expenses }) => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const userId = localStorage?.userId;
  const svgRef = useRef(null);

  const months = {
    1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
    7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12:"December"
  };

  useEffect(() => {
    if (authLoading) return;
    const token = localStorage.getItem('authToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }, [userId, authLoading]);

  useEffect(() => {
      createPieChart(data);
  }, [data]);

  const createPieChart = (data) => {
    console.log("data", data)
    d3.select(svgRef.current).selectAll("*").remove();
  
    // Define the dimensions of the SVG container and the radius of the pie chart
    const containerWidth = 500;
    const containerHeight = 250;
    const chartWidth = 250; // Adjust as needed
    const chartHeight = 250;
    const legendWidth = 150; // Width of the legend
    const radius = Math.min(chartWidth, chartHeight) / 2;
  
    // Select the SVG element using the ref
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight);
  
    // Create a group element for the pie chart
    const chartGroup = svg.append("g")
      .attr("transform", `translate(${containerWidth / 4},${containerHeight / 2})`);
  
    // Create a group element for the legend
    const legendGroup = svg.append("g")
      .attr("transform", `translate(${(containerWidth / 4) + chartWidth - 120},${20})`);
  
    // Define the pie layout
    const pie = d3.pie().value(d => d.amount_spent)(data);
  
    // Define the arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
  
    // Create the pie slices (paths)
    const paths = chartGroup.selectAll("path")
      .data(pie)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => d3.schemeCategory10[i]);
  
    // Create a key (legend) section with category labels and colors
    const keyRects = legendGroup.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => d3.schemeCategory10[i]);
  
    const keyText = legendGroup.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 15) // Adjust the distance between color and label
      .attr("y", (d, i) => i * 20 + 10) // Adjust the vertical position
      .attr("font-size", "12px")
      .text(d => d.category_name);
  
    // Add the two values at the bottom of the key
    legendGroup
      .append("text")
      .attr("x", 0) // Adjust the horizontal position
      .attr("y", data.length * 20 + 20) // Adjust the vertical position
      .attr("font-size", "12px")
      .text(`Total Expenses: $${Math.floor(expenses)}`); // Replace "Your Value" with your desired text
  
    legendGroup
      .append("text")
      .attr("x", 0) // Adjust the horizontal position
      .attr("y", data.length * 20 + 40) // Adjust the vertical position
      .attr("font-size", "12px")
      .text(`Total Limit: $${Math.floor(limit)}`); // Replace "Your Value" with your desired text
  
    // Add labels to the pie slices
    // Add labels to the pie slices
    chartGroup.selectAll("text")
    .data(pie)
    .enter()
    .append("text")
    .attr("transform", d => {
    const centroid = data.length > 1 ? arc.centroid(d) : [0, 0];
    const x = centroid[0] * 1.5; // Adjust horizontal position
    const y = centroid[1] * 1.5; // Adjust vertical position
    return `translate(${x},${y})`;
    })
    .attr("text-anchor", "middle")
    .text(d => "$" + d.data.amount_spent.toFixed(2))
    .attr("font-size", "12px")
    .attr("fill", "white")
    .attr("font-weight", "bold");
  }
  return (
    <div style={{textAlign: "center" , margin: '2%'}}>
        <h2>Expense Breakdown This Month</h2>
      {active ? <> <svg ref={svgRef}></svg></>: <h4>Click Bar Graph to See Monthly Breakdown</h4>}
    </div>
  );
};

export default PieChart;
