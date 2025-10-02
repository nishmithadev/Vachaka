import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <h1 className="logo">Vachaka</h1>
      <nav>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>
        <Link
          to="/translator"
          className={location.pathname === "/translator" ? "active" : ""}
        >
          Translator
        </Link>
        <Link
          to="/demo"
          className={location.pathname === "/demo" ? "active" : ""}
        >
          Demo
        </Link>
      </nav>
    </header>
  );
}
