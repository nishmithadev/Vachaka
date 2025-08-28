import React from "react";
import { Bar } from "react-chartjs-2";
import "./Dashboard.css";

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

  return (
    <div className="dashboard-container">
      <h2>Vachaka Dashboard</h2>
      <Bar data={data} />
    </div>
  );
}
