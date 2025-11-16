import React, { useState } from "react";
import calculatorImg from "/Users/rakshanadevalla/dinerosaur/src/assets/calculator.png";
import powerupsImg from "/Users/rakshanadevalla/dinerosaur/src/assets/powerups.png";
import "./Spending.css";

function Spending({
  setPage,
  balance,
  setBalance,
  accessorizeClicked,
  setAccessorizeClicked,
  dragClicked,
  setDragClicked,
  icicleClicked,
  setIcicleClicked,
  timeTravelClicked,
  setTimeTravelClicked
}) {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    if (value === "C") {
      setInput("");
    } else if (value === "=") {
      try {
        const result = eval(input); // simple demo
        setInput(result);
        setBalance(Number(result)); // update shared balance
      } catch {
        setInput("Error");
      }
    } else {
      setInput(input + value);
    }
  };

  return (
    <div className="spending-page-wrapper">
      <h1 className="spending-title">Spending / Power-Ups Page</h1>

      <button 
        onClick={() => setPage("home")}
        style={{ marginBottom: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Back to Home
      </button>

      <div className="spending-page" style={{ display: "flex", gap: "50px" }}>
        
        {/* Calculator */}
        <div className="calculator-container">
          <img src={calculatorImg} alt="Calculator" className="calculator-img" />
          <div className="calculator-display">
            <div>{input || "0"}</div>
          </div>

          {["1","2","3","+","4","5","6","-","7","8","9","*","0",".","=","/","C"].map((btn, i) => (
            <button
              key={i}
              className="calc-btn"
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Power-ups */}
        <div className="powerups-container">
          <img src={powerupsImg} alt="Powerups" className="powerups-img" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => setBalance(balance + 10)}>
              Add $10 (Current: ${balance})
            </button>
            <button onClick={() => setAccessorizeClicked(!accessorizeClicked)}>
              Accessorize {accessorizeClicked ? "✅" : "❌"}
            </button>
            <button onClick={() => setDragClicked(!dragClicked)}>
              Drag Power {dragClicked ? "✅" : "❌"}
            </button>
            <button onClick={() => setIcicleClicked(!icicleClicked)}>
              Icicle Power {icicleClicked ? "✅" : "❌"}
            </button>
            <button onClick={() => setTimeTravelClicked(!timeTravelClicked)}>
              Time Travel {timeTravelClicked ? "✅" : "❌"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spending;
