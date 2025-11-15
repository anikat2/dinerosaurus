import React, { useState } from "react";
import PowerUpsBack from "./powerUpsBack";
import AsteroidGame from "./AsteroidGame";

export default function ParentComponent() {
  const [balance, setBalance] = useState(0);
  const [accessorizeClicked, setAccessorizeClicked] = useState(false);
  const [dragClicked, setDragClicked] = useState(false);
  const [icicleClicked, setIcicleClicked] = useState(false);
  const [timeTravelClicked, setTimeTravelClicked] = useState(false);

  const allState = {
    balance,
    accessorizeClicked,
    dragClicked,
    icicleClicked,
    timeTravelClicked,
  };

  return (
    <div>
      <h1>PowerUps Dashboard</h1>

      <PowerUpsBack
        balance={balance}
        setBalance={setBalance}
        accessorizeClicked={accessorizeClicked}
        setAccessorizeClicked={setAccessorizeClicked}
        dragClicked={dragClicked}
        setDragClicked={setDragClicked}
        icicleClicked={icicleClicked}
        setIcicleClicked={setIcicleClicked}
        timeTravelClicked={timeTravelClicked}
        setTimeTravelClicked={setTimeTravelClicked}
      />

      <AsteroidGame state={allState} />
    </div>
  );
}
