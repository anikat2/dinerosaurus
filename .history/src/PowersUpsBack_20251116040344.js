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
    // Check if balance object or number
    const currentBalance = typeof balance === 'number' 
      ? balance 
      : (balance?.cash_balance || balance?.total_account_value || 0);
    
    if (currentBalance >= cost) {
      try {
        // Call the API to deduct the amount
        await delAmt(cost);
        
        // Activate the power-up
        setPowerUp(true);
        
        // Refresh the balance from the API
        const newBalance = await getBalance();
        setBalance(newBalance);
      } catch (error) {
        console.error("Error purchasing power-up:", error);
      }
    } else {
      alert(`Insufficient balance! You need $${cost} but only have $${currentBalance.toFixed(2)}`);
    }
  };

  // Get display balance
  const displayBalance = typeof balance === 'number' 
    ? balance 
    : (balance?.cash_balance || balance?.total_account_value || 0);

  return (
    <div>
      <p>Balance: ${displayBalance.toFixed(2)}</p>
      <p>Accessorize clicked? {accessorizeClicked ? "Yes" : "No"}</p>

      <button
        onClick={() => handlePurchase(20, setAccessorizeClicked)}
        disabled={displayBalance < 20}
      >
        Accessorize ($20)
      </button>

      <button
        onClick={() => handlePurchase(150, setDragClicked)}
        disabled={displayBalance < 150}
      >
        Drag ($150)
      </button>

      <button
        onClick={() => handlePurchase(20, setIcicleClicked)}
        disabled={displayBalance < 20}
      >
        Icicle ($20)
      </button>

      <button
        onClick={() => handlePurchase(20, setTimeTravelClicked)}
        disabled={displayBalance < 20}
      >
        Time Travel ($20)
      </button>
    </div>
  );
}