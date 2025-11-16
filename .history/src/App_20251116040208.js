import React, { useState } from "react";
import './App.css';
import Navbar from "./Navbar";
import TempEr from "./TempEr";
import AsteroidGame from "./AsteroidGame";
import Spending from "./Spending";
import Investing from "./Investing";

function App() {
  const [page, setPage] = useState("home");

  // Shared state
  const [balance, setBalance] = useState(1000.00);
  const [accessorizeClicked, setAccessorizeClicked] = useState(false);
  const [dragClicked, setDragClicked] = useState(false);
  const [icicleClicked, setIcicleClicked] = useState(false);
  const [timeTravelClicked, setTimeTravelClicked] = useState(false);

  const [latestPercentChange, setLatestPercentChange] = useState(0);

  return (
    <div className="App">
      <Navbar setPage={setPage} />

      {page === "home" && (
        <>
          <TempEr
            currentBalance={balance}
            setCurrentBalance={setBalance}
            onPercentChange={setLatestPercentChange}
          />

          <AsteroidGame
            balance={balance}
            setBalance={setBalance}
            latestPercentChange={latestPercentChange}
            hatPowerUp={accessorizeClicked}
            dragPowerUp={dragClicked}
            iciclePowerUp={icicleClicked}
            resetDrag={() => setDragClicked(false)}
            resetIcicle={() => setIcicleClicked(false)}
          />
        </>
      )}

      {page === "spending" && (
        <Spending
          setPage={setPage}
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
      )}
      {page === "portfolio" && (
        <Investing
          setPage={setPage}
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
      )}

    </div>
  );
}

export default App;
