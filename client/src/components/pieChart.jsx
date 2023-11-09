const PieChart = ({active, month, year }) => {

    return (
      <div>
        {active ? <h1>{month}, {year} Expenses</h1> : <h1>Click to See Monthly Breakdown</h1>}
      </div>
    );
}

export default PieChart;