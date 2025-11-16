import React, { useState, useEffect } from "react";
import calculatorImg from "./assets/calculator.png";
import powerupsImg from "./assets/powerups.png";
import "./Spending.css";
import { delAmt, getBalance } from "./api/getInfo";

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

  // Fetch balance on mount
  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const balanceData = await getBalance();
        setBalance(balanceData);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    
    fetchBalanceData();
  }, [setBalance]);

  // Get current cash balance from balance object
  const currentBalance = balance?.cash_balance || 0;

  const handleClick = (value) => {
    if (value === "C") {
      setInput("");
    } else if (value === "=") {
      try {
        const result = eval(input); // simple demo
        setInput(result);
        // Note: This calculator updates local input but doesn't affect actual balance
      } catch {
        setInput("Error");
      }
    } else {
      setInput(input + value);
    }
  };

  const handlePowerUpPurchase = async (cost, setPowerUp, powerUpName) => {
    if (currentBalance >= cost) {
      try {
        const result = await delAmt(cost);
        
        if (result.status === "success") {
          setPowerUp(true);
          const newBalance = await getBalance();
          setBalance(newBalance);
          alert(`${powerUpName} purchased for $${cost}!`);
        } else {
          alert(result.message || "Purchase failed");
        }
      } catch (error) {
        console.error("Error purchasing power-up:", error);
        alert("Failed to purchase power-up");
      }
    } else {
      alert(`Insufficient balance! You need $${cost} but only have $${currentBalance.toFixed(2)}`);
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
            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
              Cash Balance: ${currentBalance.toFixed(2)}
            </div>
            
            <button 
              onClick={() => handlePowerUpPurchase(20, setAccessorizeClicked, "Accessorize")}
              disabled={currentBalance < 20 || accessorizeClicked}
            >
              Accessorize - $20 {accessorizeClicked ? "✅" : "❌"}
            </button>
            
            <button 
              onClick={() => handlePowerUpPurchase(150, setDragClicked, "Drag Power")}
              disabled={currentBalance < 150 || dragClicked}
            >
              Drag Power - $150 {dragClicked ? "✅" : "❌"}
            </button>
            
            <button 
              onClick={() => handlePowerUpPurchase(20, setIcicleClicked, "Icicle Power")}
              disabled={currentBalance < 20 || icicleClicked}
            >
              Icicle Power - $20 {icicleClicked ? "✅" : "❌"}
            </button>
            
            <button 
              onClick={() => handlePowerUpPurchase(20, setTimeTravelClicked, "Time Travel")}
              disabled={currentBalance < 20 || timeTravelClicked}
            >
              Time Travel - $20 {timeTravelClicked ? "✅" : "❌"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spending;