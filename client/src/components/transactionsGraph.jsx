import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import * as d3 from 'd3';

const TransactionsGraph = ({ year }) => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const userId = localStorage?.userId;
  const svgRef = useRef();
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

        const income = await axios.get(`http://localhost:8081/api/income/totals/${userId}/${year}`);
        setIncomeData(income.data);

        const expenses = await axios.get(`http://localhost:8081/api/expense/totals/${userId}/${year}`);
        setExpenseData(expenses.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId, authLoading, year]);

  useEffect(() => {
    if (incomeData.length > 0 && expenseData.length > 0) {
      drawGraph();
    }
  }, [incomeData, expenseData]);

  const drawGraph = () => {
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const width = 750;
    const height = 400;
    const margin = { top: 20, right: 50, bottom: 70, left: 80 }; // Adjusted top margin here

    const monthsAbbreviation = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];

    // Convert month numbers to abbreviated month names
    const parseMonth = month => monthsAbbreviation[month - 1];

    const formattedIncomeData = incomeData.map(item => ({
      ...item,
      month: parseMonth(item.month)
    }));

    const formattedExpenseData = expenseData.map(item => ({
      ...item,
      month: parseMonth(item.month)
    }));

    const xScale = d3.scaleBand()
      .domain(formattedIncomeData.map(d => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(
        d3.max(formattedIncomeData, d => d.totalIncome),
        d3.max(formattedExpenseData, d => d.totalExpense)
      )])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('.income-bar')
      .data(formattedIncomeData)
      .enter()
      .append('rect')
      .attr('class', 'income-bar')
      .attr('x', d => xScale(d.month))
      .attr('y', d => yScale(d.totalIncome))
      .attr('width', xScale.bandwidth() / 2)
      .attr('height', d => yScale(0) - yScale(d.totalIncome))
      .attr('fill', 'steelblue');

    svg.selectAll('.expense-bar')
      .data(formattedExpenseData)
      .enter()
      .append('rect')
      .attr('class', 'expense-bar')
      .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.totalExpense))
      .attr('width', xScale.bandwidth() / 2)
      .attr('height', d => yScale(0) - yScale(d.totalExpense))
      .attr('fill', 'orange');

    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    const yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => '$' + d3.format('.2s')(d))); // Add '$' to y-axis labels

    xAxis.selectAll('text')
      .attr('font-size', '12px');

    yAxis.selectAll('text')
      .attr('font-size', '12px');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .text('Month');

    svg.append('text')
      .attr('x', -(height / 2))
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Amount');

       // Legend for Income and Expenses
    const legend = svg.append('g')
    .attr('transform', `translate(${width - margin.right + 20},${margin.top})`);

  legend.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', 'steelblue');

  legend.append('text')
    .attr('x', 20)
    .attr('y', 10)
    .text('Total Income')
    .style('font-size', '12px');

  legend.append('rect')
    .attr('x', 0)
    .attr('y', 20)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', 'orange');

  legend.append('text')
    .attr('x', 20)
    .attr('y', 30)
    .text('Total Expenses')
    .style('font-size', '12px');
  };

  return (
    <svg ref={svgRef} width={850} height={400}></svg>
  );
};

export default TransactionsGraph;
