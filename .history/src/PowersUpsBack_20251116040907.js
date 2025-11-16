import React from "react";
import { delAmt, getBalance } from "./api/getInfo";

export default function PowerUpsBack({
  balance,
  setBalance,
  accessorizeClicked,
  setAccessorizeClicked,
  dragClicked,
  setDragClicked,
  icicleClicked,
  setIcicleClicked,
  timeTravelClicked,
  setTimeTravelClicked,
}) {
  const handlePurchase = async (cost, setPowerUp) => {
    // Get the actual cash balance from the balance object
    const currentCashBalance = balance?.cash_balance || 0;
    
    if (currentCashBalance >= cost) {
      try {
        // Call the API to deduct the amount
        const result = await delAmt(cost);
        
        if (result.status === "success") {
          // Activate the power-up
          setPowerUp(true);
          
          // Refresh the balance from the API to get updated values
          const newBalance = await getBalance();
          setBalance(newBalance);
        } else {
          alert(result.message || "Purchase failed");
        }
      } catch (error) {
        console.error("Error purchasing power-up:", error);
        alert("Failed to purchase power-up");
      }
    } else {
      alert(`Insufficient balance! You need $${cost} but only have $${currentCashBalance.toFixed(2)}`);
    }
  };

  // Get display balance from the balance object
  const displayBalance = balance?.cash_balance || 0;

  return (
    <div>
      <p>Cash Balance: ${displayBalance.toFixed(2)}</p>
      <p>Total Account Value: ${(balance?.total_account_value || 0).toFixed(2)}</p>
      <p>Accessorize clicked? {accessorizeClicked ? "Yes" : "No"}</p>

      <button
        onClick={() => handlePurchase(20, setAccessorizeClicked)}
        disabled={displayBalance < 20}
      >
        Accessorize ($20) {displayBalance < 20 && "- Insufficient Funds"}
      </button>

      <button
        onClick={() => handlePurchase(150, setDragClicked)}
        disabled={displayBalance < 150}
      >
        Drag ($150) {displayBalance < 150 && "- Insufficient Funds"}
      </button>

      <button
        onClick={() => handlePurchase(20, setIcicleClicked)}
        disabled={displayBalance < 20}
      >
        Icicle ($20) {displayBalance < 20 && "- Insufficient Funds"}
      </button>

      <button
        onClick={() => handlePurchase(20, setTimeTravelClicked)}
        disabled={displayBalance < 20}
      >
        Time Travel ($20) {displayBalance < 20 && "- Insufficient Funds"}
      </button>
    </div>
  );
}