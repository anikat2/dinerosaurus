import React from "react";
import { delAmt } from "./api/getInfo";

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
  return (
    <div>
      <p>Balance: {balance}</p>
      <p>Accessorize clicked? {accessorizeClicked ? "Yes" : "No"}</p>

      <button
        onClick={() => {
          if(balance >= 20) {
            delAmt(20);
            setAccessorizeClicked(true);
          }
        }}
      >
        Accessorize
      </button>

      <button
        onClick={() => {
          if(balance >= 150) {
            delAmt(150);
            setDragClicked(true);
          }
        }}
      >
        Drag
      </button>

      <button
        onClick={() => {
          if(balance >= 20) {
            delAmt(20);
            setIcicleClicked(true);
          }
        }}
      >
        Icicle
      </button>

      <button
        onClick={() => {
          if(balance >= 20) {
            delAmt(20);
            setTimeTravelClicked(true);
          }
        }}
      >
        Time Travel
      </button>
    </div>
  );
}
