import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "./Dashboard.css";

// Register Chart.js components once
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Translations",
        data: [12, 19, 7, 14],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Translations" },
    },
  };

  return (
    <div className="dashboard-container">
      <h2>Vachaka Dashboard</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
