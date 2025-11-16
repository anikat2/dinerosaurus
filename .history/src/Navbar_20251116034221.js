import React from "react";
import "./NavBar.css";
import dinoLogo from "/Users/rakshanadevalla/dinerosaur/src/assets/dinosaurlogosrc.png"; // adjust path if needed


export default function Navbar({ setPage }) {
  return (
    <nav className="bone-navbar">
    <img src={dinoLogo} alt="logo" className="nav-logo" />


      <div className="nav-links">
        <button onClick={() => setPage("home")}>🏠 Home</button>
        <button onClick={() => setPage("spending")}>🪙 Spending</button>
        <button onClick={() => setPage("portfolio")}>📊 Portfolio</button>
      </div>
    </nav>
  );
}
