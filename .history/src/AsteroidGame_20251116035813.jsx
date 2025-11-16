{/* Display balance information from /balance endpoint */}
      <div style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.8" }}>
        {balanceData ? (
          <>
            <div style={{ marginBottom: "10px", fontSize: "12px", color: "#666" }}>
              Raw data: {JSON.stringify(balanceData)}
            </div>
            <div><strong>Cash Balance:</strong> ${balanceData.cash_balance?.toFixed(2) ||import React, { useState, useEffect, useRef } from "react";
import earth from "./assets/earth.png";
import dino from "./assets/dino.png";
import asteroidImg from "./assets/asteroid.png";
import hat from "./assets/halloweenhatpowerup.png";
import "./AsteroidGame.css";
import { getBalance } from "./api/getInfo";

export default function AsteroidGame({
  balance,              // shared balance
  setBalance,           // update balance
  latestPercentChange,  // portfolio percent change from TempEr
  hatPowerUp,
  dragPowerUp,
  iciclePowerUp,
  resetDrag,
  resetIcicle,
}) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [balanceData, setBalanceData] = useState(null);

  const dinoWidth = 300;
  const dinoHeight = 300;
  const asteroidWidth = 200;
  const asteroidHeight = 200;

  // Fetch balance data on mount and periodically
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await getBalance();
        console.log("Balance data received:", data); // Debug log
        
        // Only update if we have valid data
        if (data && (data.cash_balance > 0 || data.portfolio_value > 0 || data.total_account_value > 0)) {
          setBalanceData(data);
        } else if (!balanceData) {
          // If no valid data yet, keep trying more frequently
          setTimeout(fetchBalance, 1000);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        // Retry on error
        setTimeout(fetchBalance, 2000);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [balanceData]);

  // Set initial asteroid position (top-right corner)
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setPosition({ top: 0, left: containerWidth - asteroidWidth });
    }
  }, []);

  // Move asteroid whenever portfolio percent change is negative
  useEffect(() => {
    if (latestPercentChange < 0) moveAsteroid();
  }, [latestPercentChange]);

  const moveAsteroid = () => {
    if (gameOver) return;

    // Icicle powerup freezes asteroid once
    if (iciclePowerUp) {
      resetIcicle();
      return;
    }

    const horizontalStep = dragPowerUp ? 6 : 12;
    const verticalStep = dragPowerUp ? 2 : 5;

    if (dragPowerUp) resetDrag();

    setPosition((prev) => {
      const newTop = prev.top + verticalStep;
      const newLeft = Math.max(prev.left - horizontalStep, 0);

      const container = containerRef.current;
      const dinoX = container.offsetWidth / 2 - dinoWidth / 2;
      const dinoY = container.offsetHeight - dinoHeight;

      const asteroidX = newLeft;
      const asteroidY = newTop;

      const hitboxOffset = -10;
      const isCollision =
        asteroidX < dinoX + dinoWidth - hitboxOffset &&
        asteroidX + asteroidWidth > dinoX + hitboxOffset &&
        asteroidY < dinoY + dinoHeight - hitboxOffset &&
        asteroidY + asteroidHeight > dinoY + hitboxOffset;

      if (isCollision) {
        setGameOver(true);
      }

      return { top: newTop, left: newLeft };
    });
  };

  return (
    <div className="asteroid-layout">
      {/* Game Area */}
      <div ref={containerRef} className="asteroid-container">
        <div className="earth-dino-wrapper">
          <img src={earth} alt="earth" className="earth" />
          <img src={dino} alt="dino" className="dino" />
          {hatPowerUp && (
            <img
              src={hat}
              alt="Hat Power-Up"
              style={{
                position: "absolute",
                bottom: `${dinoHeight - 65}px`,
                left: "70px",
                width: "50px",
                zIndex: 2
              }}
            />
          )}
        </div>

        {!gameOver && (
          <img
            src={asteroidImg}
            alt="asteroid"
            className="asteroid"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
          />
        )}

        {gameOver && (
          <div className="asteroid-game-over">💥 Game Over! 💥</div>
        )}
      </div>

      {/* Debug/Test button */}
      <button style={{ marginTop: "20px" }} onClick={moveAsteroid}>
        Test Move Asteroid
      </button>

      {/* Display balance information from /balance endpoint */}
      <div style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.8" }}>
        {balanceData ? (
          <>
            <div><strong>Cash Balance:</strong> ${balanceData.cash_balance?.toFixed(2) || "0.00"}</div>
            <div><strong>Portfolio Value:</strong> ${balanceData.portfolio_value?.toFixed(2) || "0.00"}</div>
            <div><strong>Total Account Value:</strong> ${balanceData.total_account_value?.toFixed(2) || "0.00"}</div>
            <div style={{ color: balanceData.total_gain_loss >= 0 ? "green" : "red" }}>
              <strong>Total Gain/Loss:</strong> ${balanceData.total_gain_loss?.toFixed(2) || "0.00"} 
              ({balanceData.total_gain_loss >= 0 ? "+" : ""}{((balanceData.total_gain_loss / balanceData.starting_balance) * 100).toFixed(2)}%)
            </div>
          </>
        ) : (
          <div>Loading balance...</div>
        )}
      </div>
    </div>
  );
}