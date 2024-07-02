import React, { useRef } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Chart = ({ data, isUserChart }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: isUserChart ? data.map(user => `User ${user.userId}`) : data.map(item => item.title),
    datasets: [
      {
        label: isUserChart ? 'Number of Bids' : 'Number of Bids',
        data: isUserChart ? data.map(user => user.bids) : data.map(item => item.bids ? Object.keys(item.bids).length : 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,  // Asegura que solo se muestren números enteros
          precision: 0, // Remueve decimales
        },
      },
    },
  };

  return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
};

export default Chart;
