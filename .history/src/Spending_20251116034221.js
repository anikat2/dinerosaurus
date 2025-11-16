import React, { useState } from "react";
<<<<<<< HEAD
import calculatorImg from "./calculator.png";
import powerupsImg from "./powerups.png";
import "./Spending.css";

function Spending() {
=======
import calculatorImg from "/Users/rakshanadevalla/dinerosaur/src/assets/calculator.png";
import powerupsImg from "/Users/rakshanadevalla/dinerosaur/src/assets/powerups.png";
import "./Spending.css";

function Spending({
  setPage,
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
>>>>>>> 502b28a6b0b873db46bc16d01c7b0b103adeee62
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    if (value === "C") {
      setInput("");
    } else if (value === "=") {
      try {
<<<<<<< HEAD
        setInput(eval(input));
=======
        const result = eval(input); // simple demo
        setInput(result);
        setBalance(Number(result)); // update shared balance
>>>>>>> 502b28a6b0b873db46bc16d01c7b0b103adeee62
      } catch {
        setInput("Error");
      }
    } else {
      setInput(input + value);
    }
  };

  return (
    <div className="spending-page-wrapper">
<<<<<<< HEAD
      <h1 className="spending-title">Spending Page</h1>

      <div className="spending-page">
        <div className="calculator-container">
          <img src={calculatorImg} alt="Calculator" className="calculator-img" />

=======
      <h1 className="spending-title">Spending / Power-Ups Page</h1>

      <button 
        onClick={() => setPage("home")}
        style={{ marginBottom: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Back to Home
      </button>

      <div className="spending-page" style={{ display: "flex", gap: "50px" }}>
        
        {/* Calculator */}
        <div className="calculator-container">
          <img src={calculatorImg} alt="Calculator" className="calculator-img" />
>>>>>>> 502b28a6b0b873db46bc16d01c7b0b103adeee62
          <div className="calculator-display">
            <div>{input || "0"}</div>
          </div>

<<<<<<< HEAD
          {/* Calculator Buttons */}
          <button className="calc-btn" style={{ top: "115px", left: "35px" }} onClick={() => handleClick("1")}>1</button>
          <button className="calc-btn" style={{ top: "115px", left: "101px" }} onClick={() => handleClick("2")}>2</button>
          <button className="calc-btn" style={{ top: "115px", left: "166px" }} onClick={() => handleClick("3")}>3</button>
          <button className="calc-btn" style={{ top: "115px", left: "229px" }} onClick={() => handleClick("+")}>+</button>

          <button className="calc-btn" style={{ top: "165px", left: "35px" }} onClick={() => handleClick("4")}>4</button>
          <button className="calc-btn" style={{ top: "165px", left: "101px" }} onClick={() => handleClick("5")}>5</button>
          <button className="calc-btn" style={{ top: "165px", left: "166px" }} onClick={() => handleClick("6")}>6</button>
          <button className="calc-btn" style={{ top: "165px", left: "229px" }} onClick={() => handleClick("-")}>-</button>

          <button className="calc-btn" style={{ top: "217px", left: "35px" }} onClick={() => handleClick("7")}>7</button>
          <button className="calc-btn" style={{ top: "217px", left: "101px" }} onClick={() => handleClick("8")}>8</button>
          <button className="calc-btn" style={{ top: "217px", left: "166px" }} onClick={() => handleClick("9")}>9</button>
          <button className="calc-btn" style={{ top: "217px", left: "229px" }} onClick={() => handleClick("*")}>*</button>

          <button className="calc-btn" style={{ top: "274px", left: "35px" }} onClick={() => handleClick("0")}>0</button>
          <button className="calc-btn" style={{ top: "274px", left: "101px" }} onClick={() => handleClick(".")}>.</button>
          <button className="calc-btn" style={{ top: "274px", left: "166px" }} onClick={() => handleClick("=")}>=</button>
          <button className="calc-btn" style={{ top: "274px", left: "229px" }} onClick={() => handleClick("/")}>/</button>

          <button className="calc-btn" style={{ top: "328px", left: "35px", width: "176px", height: "46px"}} onClick={() => handleClick("C")}>C</button>
        </div>

        <div className="powerups-container">
          <img src={powerupsImg} alt="Powerups" className="powerups-img" />
=======
          {["1","2","3","+","4","5","6","-","7","8","9","*","0",".","=","/","C"].map((btn, i) => (
            <button
              key={i}
              className="calc-btn"
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Power-ups */}
        <div className="powerups-container">
          <img src={powerupsImg} alt="Powerups" className="powerups-img" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => setBalance(balance + 10)}>
              Add $10 (Current: ${balance})
            </button>
            <button onClick={() => setAccessorizeClicked(!accessorizeClicked)}>
              Accessorize {accessorizeClicked ? "✅" : "❌"}
            </button>
            <button onClick={() => setDragClicked(!dragClicked)}>
              Drag Power {dragClicked ? "✅" : "❌"}
            </button>
            <button onClick={() => setIcicleClicked(!icicleClicked)}>
              Icicle Power {icicleClicked ? "✅" : "❌"}
            </button>
            <button onClick={() => setTimeTravelClicked(!timeTravelClicked)}>
              Time Travel {timeTravelClicked ? "✅" : "❌"}
            </button>
          </div>
>>>>>>> 502b28a6b0b873db46bc16d01c7b0b103adeee62
        </div>
      </div>
    </div>
  );
}

export default Spending;
