import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Vachaka | All Rights Reserved</p>
      <div className="social-links">
        <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦</a>
        <a href="https://github.com" target="_blank" rel="noreferrer">💻</a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">🔗</a>
      </div>
    </footer>
  );
};

export default Footer;
