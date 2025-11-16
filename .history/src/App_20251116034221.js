import React, { useState } from "react";
<<<<<<< HEAD
import logo from './logo.svg';
import './App.css';
=======
import './App.css';
import Navbar from "./Navbar";
import TempEr from "./TempEr";
import AsteroidGame from "./AsteroidGame";
>>>>>>> 502b28a6b0b873db46bc16d01c7b0b103adeee62
import Spending from "./Spending";

function App() {
  const [page, setPage] = useState("home");

<<<<<<< HEAD
  return (
    <div className="App">
      {page === "home" && (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Edit <code>src/App.js</code> and save to reload.</p>

          <button onClick={() => setPage("spending")}>
            Go to Spending
          </button>
        </header>
      )}

      {page === "spending" && <Spending />}
=======
  // Shared state
  const [balance, setBalance] = useState(50);
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
>>>>>>> 502b28a6b0b873db46bc16d01c7b0b103adeee62
    </div>
  );
}

export default App;
