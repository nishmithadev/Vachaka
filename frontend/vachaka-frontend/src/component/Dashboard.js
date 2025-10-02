import React, { useState } from "react";
import HandTracker from "../component/HandTracker";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [detectedSign, setDetectedSign] = useState(null);
  const [history, setHistory] = useState([]);

  // This function will be called when CameraInput detects a sign
  const handleDetection = (sign) => {
    if (sign) {
      setDetectedSign(sign);
      setHistory((prev) => [...prev, sign].slice(-10)); // keep last 10
    }
  };

  // Count frequency for chart
  const frequencies = history.reduce((acc, sign) => {
    acc[sign] = (acc[sign] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(frequencies),
    datasets: [
      {
        label: "Frequency",
        data: Object.values(frequencies),
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Detected Signs Frequency" },
    },
  };

  return (
    <div className="dashboard">
      <h1>Vachaka Dashboard</h1>

      <div className="dashboard-grid">
        {/* Left side: Camera feed + detected sign */}
        <div className="video-section">
          <HandTracker onResults={handleDetection} />
          <div className="detected-box">
            Detected Sign:{" "}
            <strong>{detectedSign ? detectedSign : "Waiting..."}</strong>
          </div>
        </div>

        {/* Right side: Chart + history */}
        <div className="stats-section">
          <Bar data={chartData} options={chartOptions} />
          <h3>History</h3>
          <ul className="history-list">
            {history.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          <button onClick={() => setHistory([])}>Clear History</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
