import React from 'react';
import { Bar } from 'react-chartjs-2';
import "./HorizontalBarChart.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

const HorizontalBarChart = ({catData, labels, color}) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

  // 데이터 설정
  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: `${color}`,
        borderColor: `${color}`,
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: catData,
      },
    ],
  };

  // 그래프 옵션 설정
  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: false,
          text: 'Chart.js Horizontal Bar Chart',
        },
        scales: {
            x: {
              ticks: {
                color: 'white', // X 축 눈금의 글자 색깔
              },
            },
            y: {
              ticks: {
                color: 'white', // Y 축 눈금의 글자 색깔
              },
            },
        }
      },
  };

  return (
    <div style={{width:'70%'}}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalBarChart;