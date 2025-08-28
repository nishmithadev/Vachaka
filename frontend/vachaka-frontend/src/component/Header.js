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
          to="/translator"
          className={location.pathname === "/translator" ? "active" : ""}
        >
          Translator
        </Link>
      </nav>
    </header>
  );
}
