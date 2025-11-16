import React, { useState } from "react";
import PowerUpsBack from "./PowersUpsBack";
import AsteroidGame from "./AsteroidGame";
import TempEr from "./TempEr";

export default function ParentComponent({
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
  const [latestPercentChange, setLatestPercentChange] = useState(0);

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

      {/* Portfolio Chart */}
      <TempEr onPercentChange={setLatestPercentChange} />

      {/* Asteroid Game */}
      <AsteroidGame
        latestPercentChange={latestPercentChange}
        hatPowerUp={accessorizeClicked}
        dragPowerUp={dragClicked}
        iciclePowerUp={icicleClicked}
        resetDrag={() => setDragClicked(false)}
        resetIcicle={() => setIcicleClicked(false)}
      />
    </div>
  );
}
