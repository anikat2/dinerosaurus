import React from "react";

export default function powerUpsBack({
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

  return (
    <div>
      <p>Balance: {balance}</p>
      <p>Accessorize clicked? {accessorizeClicked ? "Yes" : "No"}</p>

      <button
        onClick={() => {
          setBalance(prev => prev - 20);
          setAccessorizeClicked(true);
        }}
      >
        Accessorize
      </button>

      <button
        onClick={() => {
          setBalance(prev => prev - 150);
          setDragClicked(true);
        }}
      >
        Drag
      </button>

      <button
        onClick={() => {
          setBalance(prev => prev - 20);
          setIcicleClicked(true);
        }}
      >
        Icicle
      </button>

      <button
        onClick={() => {
          setBalance(prev => prev - 20);
          setTimeTravelClicked(true);
        }}
      >
        Time Travel
      </button>
    </div>
  );
}
