import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Filler,
} from 'chart.js';
import React from 'react';
import { useAPI } from '../apiContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, Filler);

const LoadChart = () => {
    const data  = useAPI();

    const chartData = {
      title: "CPU Load",
        labels: data.loadData?.map(point => new Date(point.time).toLocaleTimeString()),
        datasets: [{
            label: 'Load Average',
            data: data.loadData?.map(point => point.average),
            tension: .2,
            backgroundColor: 'gray',
            fill: true
        }
    ]};
       
    const options = {
      responsive: true,
      scales: {
        y: {max: 1.5, min: 0, ticks: {stepSize: 0.1} },
      },
    };
  
   return (
    <Line data={chartData} options={options} />
    );
  };
  
  export default LoadChart;
  