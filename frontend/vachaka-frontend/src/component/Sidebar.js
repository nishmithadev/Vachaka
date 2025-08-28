import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Vachaka</h2>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/translate">Translate</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
}
