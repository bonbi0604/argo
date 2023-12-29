import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js';



const DonutChart = ({cat, color, score, size}) => {
  Chart.register(ArcElement);
  
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

  const temp = (1-7/Number(size.slice(0, -1)))*100;

  const options = {
    cutout : temp.toString() + "%",
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
  };

  return (
    <div className="donutchart_element" style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} style={{ width: "100%", height: "100%" }}/>
    </div>
  );
};

export default DonutChart;