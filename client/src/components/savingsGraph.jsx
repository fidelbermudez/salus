import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import * as d3 from 'd3';

const SavingsGraph = ({ year }) => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const userId = localStorage?.userId;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    const token = localStorage.getItem('authToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    const fetchData = async () => {
      try {
        const savings = await axios.get(`http://localhost:8081/api/savingsHistory/year/${year}/${userId}`);
        setData(savings.data);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          console.log('No entries found for the specified year');
          setData([]);
        } else {
          console.error(e);
          setData([]);
        }
      }
    };

    fetchData();
  }, [userId, authLoading, year]);

  const svgRef = useRef();
  const [showLines, setShowLines] = useState({});

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 800; // Increase width for legend
    const height = 400;
    const margin = { top: 20, right: 120, bottom: 30, left: 60 }; // Adjust right margin for legend

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleTime().range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.amount));

    const xAxis = g => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%m/%d/%Y')));

    const yAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format('$,.2f')));

    svg.selectAll('*').remove();

    if (data.length > 0) {
      let maxCumulative = 0;
      const selectedData = data.filter(category => showLines[category._id]);

      const cumulativeData = selectedData.map(category => {
        let cumulativeAmount = 0;
        return category.data.map(d => {
          cumulativeAmount += d.amount;
          maxCumulative = Math.max(maxCumulative, cumulativeAmount);
          return { date: new Date(d.date), amount: cumulativeAmount };
        });
      }).flat();

      x.domain(d3.extent(cumulativeData, d => d.date));
      y.domain([0, maxCumulative]).nice();

      svg.append('g').attr('class', 'x-axis').call(xAxis);
      svg.append('g').attr('class', 'y-axis').call(yAxis);

      selectedData.forEach((category, index) => {
        const parsedData = [];
        let cumulativeAmount = 0;

        category.data.forEach(d => {
          cumulativeAmount += d.amount;
          const parsedDate = new Date(d.date);

          if (isNaN(cumulativeAmount) || isNaN(parsedDate)) {
            console.error('NaN values detected:', category._id, d);
          }

          parsedData.push({ date: parsedDate, amount: cumulativeAmount });
        });

        svg.append('path')
          .datum(parsedData)
          .attr('fill', 'none')
          .attr('stroke', d3.schemeCategory10[index % 10])
          .attr('stroke-width', 2)
          .attr('d', line);
      });

      // Create color legend
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - margin.right + 10},${margin.top})`); // Adjust transform for legend

      const legendEntries = legend.selectAll('.legendEntry')
        .data(selectedData)
        .enter()
        .append('g')
        .attr('class', 'legendEntry')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

      legendEntries.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', (d, i) => d3.schemeCategory10[i % 10]);

      legendEntries.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text(d => d._id)
        .style('font-size', '12px');
    }
  }, [data, showLines, year]);

  const handleCheckboxChange = (categoryName) => {
    setShowLines(prevState => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div>
        {data.length > 0 && data.map((category, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                checked={showLines[category._id] || false}
                onChange={() => handleCheckboxChange(category._id)}
              />
              {category._id}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsGraph;