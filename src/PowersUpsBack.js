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
  // Get current cash balance from balance object
  const currentBalance = balance?.cash_balance || 0;

  return (
    <div>
      <p>Balance: ${currentBalance.toFixed(2)}</p>
      <p>Accessorize clicked? {accessorizeClicked ? "Yes" : "No"}</p>

      <button
        onClick={async () => {
          if(currentBalance >= 20) {
            await delAmt(20);
            const newBalance = await getBalance();
            setBalance(newBalance);
            setAccessorizeClicked(true);
          }
        }}
      >
        Accessorize
      </button>

      <button
        onClick={async () => {
          if(currentBalance >= 150) {
            await delAmt(150);
            const newBalance = await getBalance();
            setBalance(newBalance);
            setDragClicked(true);
          }
        }}
      >
        Drag
      </button>

      <button
        onClick={async () => {
          if(currentBalance >= 20) {
            await delAmt(20);
            const newBalance = await getBalance();
            setBalance(newBalance);
            setIcicleClicked(true);
          }
        }}
      >
        Icicle
      </button>

      <button
        onClick={async () => {
          if(currentBalance >= 20) {
            await delAmt(20);
            const newBalance = await getBalance();
            setBalance(newBalance);
            setTimeTravelClicked(true);
          }
        }}
      >
        Time Travel
      </button>
    </div>
  );
}