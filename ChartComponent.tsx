import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Brush } from 'recharts';
import axios from 'axios';
import html2canvas from 'html2canvas';

interface ChartData {
  timestamp: string;
  value: number;
}

const ChartComponent = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState('daily');
  const [zoomed, setZoomed] = useState(false);
  const [selectedData, setSelectedData] = useState<ChartData | null>(null);

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

  const handleZoom= () => {
    setZoomed(!zoomed);
  };

  const handleBrush = (brush: any) => {
    const startIndex = brush.x[0];
    const endIndex = brush.x[1];
    const filteredData = chartData.slice(startIndex, endIndex);
    setSelectedData(filteredData[0]);
  };

  const handleExport = () => {
    const chartContainer = document.getElementById('chart-container');
    html2canvas(chartContainer as HTMLElement).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'chart.png';
      link.click();
    });
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
      <button onClick={handleZoom}>Zoom</button>
      <button onClick={handleExport}>Export</button>
      <div id="chart-container">
        <LineChart width={800} height={400} data={filteredData}>
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Tooltip />
          <Brush onChange={handleBrush} />
        </LineChart>
      </div>
      {selectedData && (
        <div>
          <h2>Selected Data:</h2>
          <p>Timestamp: {selectedData.timestamp}</p>
          <p>Value: {selectedData.value}</p>
        </div>
      )}
    </div>
  );
};

export default ChartComponent;

  
