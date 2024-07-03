import React, { useRef } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Chart2 = ({ data }) => {
  const chartRef = useRef(null);

  // Verifica los datos que está recibiendo
  console.log(data);

  const chartData = {
    labels: data.map(item => item.title),
    datasets: [
      {
        label: 'Number of Bids',
        data: data.map(item => item.bids ? Object.keys(item.bids).length : 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color rojo
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        min: 0, // Valor mínimo del eje Y
        max: 5, // Valor máximo del eje Y
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
};

export default Chart2;
