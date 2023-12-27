import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js';

Chart.register(ArcElement);

const DonutChart = ({cat, color, score, size}) => {
  const data = {
    labels: [cat, "none"],
    datasets: [
      {
        data: [score, 100-score],
        backgroundColor: [color, '#fff'],
        hoverBackgroundColor: [color, '#fff'],
        borderRadius: 10,
      },
    ],
  };

  const temp = (1-2/Number(size.slice(0, -2)))*100;

  const options = {
    cutout : temp.toString() + "%",
    maintainAspectRatio: false,
  };

  return (
    <div className="donutchart_element" style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;