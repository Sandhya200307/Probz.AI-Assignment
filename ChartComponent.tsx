import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';

interface ChartData {
  timestamp: string;
  value: number;
}

const ChartComponent = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState('daily');

  useEffect(() => {
    axios.get('chart-data.json')
      .then(response => {
        setChartData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(event.target.value);
  };

  const filteredData = chartData.filter((data, index) => {
    if (timeframe === 'daily') {
      return index % 24 === 0;
    } else if (timeframe === 'weekly') {
      return index % 168 === 0;
    } else {
      return index % 720 === 0;
    }
  });

  return (
    <div>
      <select value={timeframe} onChange={handleTimeframeChange}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <LineChart width={800} height={400} data={filteredData}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default ChartComponent;
