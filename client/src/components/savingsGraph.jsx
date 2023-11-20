import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const SavingsGraph = () => {
  const data = {
    car: [
      { date: '1/3/2023', amount: 800 },
      { date: '2/17/2023', amount: 1200 },
      { date: '3/8/2023', amount: 1000 },
      { date: '4/22/2023', amount: 1600 },
      { date: '5/12/2023', amount: 1400 },
      { date: '6/30/2023', amount: 2000 },
    ],
    house: [
      { date: '1/7/2023', amount: 500 },
      { date: '2/19/2023', amount: 900 },
      { date: '3/15/2023', amount: 700 },
      { date: '4/25/2023', amount: 1200 },
      { date: '5/5/2023', amount: 1000 },
      { date: '6/10/2023', amount: 1500 },
    ],
    vacation: [
      { date: '1/12/2023', amount: 200 },
      { date: '2/28/2023', amount: 300 },
      { date: '3/5/2023', amount: 400 },
      { date: '4/14/2023', amount: 500 },
      { date: '5/21/2023', amount: -600 },
      { date: '6/8/2023', amount: 700 },
    ]
  };

  const svgRef = useRef();
  const [showLines, setShowLines] = useState({});

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleTime()
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.amount));

    const xAxis = g => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%m/%d/%Y')));

    const yAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format('$,.2f')));

    svg.selectAll('*').remove();

    if (Object.keys(data).length > 0) {
      let maxCumulative = 0;
      const selectedData = Object.keys(data).filter(key => showLines[key]);

      const cumulativeData = selectedData.map(key => {
        let cumulativeAmount = 0;
        return data[key].map(d => {
          cumulativeAmount += d.amount;
          maxCumulative = Math.max(maxCumulative, cumulativeAmount);
          return { date: d3.timeParse('%m/%d/%Y')(d.date), amount: cumulativeAmount };
        });
      }).flat();

      x.domain(d3.extent(cumulativeData, d => d.date));
      y.domain([0, maxCumulative]).nice();

      svg.append('g').attr('class', 'x-axis').call(xAxis);
      svg.append('g').attr('class', 'y-axis').call(yAxis);
      Object.keys(data).forEach(key => {
        if (showLines[key]) {
          const parsedData = [];
          let cumulativeAmount = 0;

          data[key].forEach(d => {
            cumulativeAmount += d.amount;
            const parsedDate = d3.timeParse('%m/%d/%Y')(d.date);

            if (isNaN(cumulativeAmount) || isNaN(parsedDate)) {
              console.error('NaN values detected:', key, d);
            }

            parsedData.push({ date: parsedDate, amount: cumulativeAmount });
          });

          svg.append('path')
            .datum(parsedData)
            .attr('fill', 'none')
            .attr('stroke', d3.schemeCategory10[Object.keys(data).indexOf(key) % 10])
            .attr('stroke-width', 2)
            .attr('d', line);
        }
      });
    }
  }, [data, showLines]);

  const handleCheckboxChange = (lineName) => {
    setShowLines((prevState) => ({
      ...prevState,
      [lineName]: !prevState[lineName],
    }));
  };

  return (
    <div>
      {Object.keys(data).map((lineName, index) => (
        <div key={index}>
          <label>
            <input
              type="checkbox"
              checked={showLines[lineName] || false}
              onChange={() => handleCheckboxChange(lineName)}
            />
            {lineName}
          </label>
        </div>
      ))}
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SavingsGraph;