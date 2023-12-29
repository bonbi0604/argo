import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';



const RadarChart = ({dataUser, dataAvg, name}) => {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );
  
  const data = {
    labels: ['Clear', 'Concise', 'Concrete', 'Correct', 'Coherent', 'Complete', 'Courteous'],
    datasets: [
        {
          label: `${name} 님`,
          data: dataUser,
          backgroundColor: 'rgba(242, 173, 0, 0.2)', // #FAE3A9
          borderColor: 'rgba(242, 173, 0, 1)',
          pointBackgroundColor: 'rgba(236, 206, 131, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(236, 206, 131, 1)',
        },
        {
          label: '평균',
          data: dataAvg,
          backgroundColor: 'rgba(179, 181, 198, 0.2)',
          borderColor: 'rgba(179, 181, 198, 1)',
          pointBackgroundColor: 'rgba(179, 181, 198, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(179, 181, 198, 1)',
        },
      ],
    };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;