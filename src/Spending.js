import React, { useState, useEffect } from "react";
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

  const buy = (cost, action) => {
    if (balance >= cost) {
      setBalance((prev) => prev - cost);
      action();
    }
  };

  const accessorize = () => {
    if (balance >= 20) {
      setBalance(prev => prev - 20);
      setAccessorizeClicked(true);
    }
  };

  const drag = () => {
    if(balance >= 150) {
      setBalance(prev => prev - 150);
      setDragClicked(true);
    }
  };

  const icicle = () => {
    if(balance >= 300) {
      setBalance(prev => prev - 300);
      setIcicleClicked(true);
    }
  };

  const timetravel = () => {
    if(balance >= 1000) {
      setBalance(prev => prev - 1000);
      setTimeTravelClicked(true);
    }
  };

  return (
    <div className="spending-wrapper">
      <h1 className="spending-title">Spending / Power-Ups</h1>

      <br></br>
      <br></br>
      <br></br>

      <div className="balance-box">
        Balance: ${balance}
      </div>

      <div className="cards">
        
        {/* Accessorize */}
        <div className="card">
          <div className="title">🎀 accessorize</div>
          <div className="subtitle">add a cute hat accessory!</div>
          <div className="buttons">
            <button className="price">$20</button>
            <button className="purchase"
              onClick={accessorize}
              disabled={accessorizeClicked || balance < 20}>purchase</button>
          </div>
        </div>

        {/* Drag */}
        <div className="card">
          <div className="title">🐢 drag</div>
          <div className="subtitle">slow down asteroid x2 for one day</div>
          <div className="buttons">
            <button className="price">$150</button>
            <button className="purchase"
              onClick={drag}
              disabled={balance < 150}>purchase</button>
          </div>
        </div>

        {/* Icicle */}
        <div className="card">
          <div className="title">🧊 icicle</div>
          <div className="subtitle">freeze the asteroid for 1 day</div>
          <div className="buttons">
            <button className="price">$300</button>
            <button className="purchase"
              onClick={icicle}
              disabled={balance < 300}>purchase</button>
          </div>
        </div>

        {/* Time Travel */}
        <div className="card">
          <div className="title">⏰ time travel</div>
          <div className="subtitle">see predictive models to aid investment decisions</div>
          <div className="buttons">
            <button className="price">$1000</button>
            <button className="purchase" 
              onClick={timetravel}
              disabled={balance < 1000}>purchase</button>
          </div>
          <br />
          <p>Ticker:
          <input
            type="text"
            className="tt-input"
            style={{ marginLeft: "10px" }}
            placeholder="enter something..."
          /></p>
        </div>

      </div>
    </div>
  );
}

export default Spending;
