import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = (dataMap) => {
    let data = []
    const values = Object.values(dataMap);
    for (const value of values) {
        data = value
      }    
    
  const svgRef = useRef(null);

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 60 }; // Adjust the left margin
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([margin.left, width]).padding(0.1); // Adjust the range
    const y = d3.scaleLinear().range([height, 0]);

    const svg = d3.select(svgRef.current);

    x.domain(
      data.map(function (d) {
        return d.name;
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.value + d.fill;
      }),
    ]);

    // Create a custom number format function to add the dollar sign
    const dollarFormat = d3.format("$,.0f");

    // Draw the main bars
    svg
      .selectAll(".bar")
      .data(data)
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
      });

    // Adding the fill bars
    svg
      .selectAll(".fill")
      .data(data)
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
      .style("fill", "orange");

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
  .style("fill", "orange");

svg
  .append("text")
  .attr("x", 150) // Adjust the x-position
  .attr("y", height + 30) // Adjust the y-position
  .text("Expenses") // Change "Fill" to "Expenses"
  .style("font-size", "12px")
  .style("alignment-baseline", "middle");


  svg
  .append("rect")
  .attr("x", 20) // Adjust the x-position
  .attr("y", height + 20) // Adjust the y-position
  .attr("width", 20)
  .attr("height", 10)
  .style("fill", "black");

svg
  .append("text")
  .attr("x", 50) // Adjust the x-position
  .attr("y", height + 30) // Adjust the y-position
  .text("Set Limit") // Change "Fill" to "Expenses"
  .style("font-size", "12px")
  .style("alignment-baseline", "middle");

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  }, [data]);

  return (
    <div className="bar-chart">
      <svg ref={svgRef} width="960" height="550">
        {/* Render the bar chart inside this SVG container */}
      </svg>
    </div>
  );
};

export default BarChart;
