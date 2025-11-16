import React, { useState } from "react";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");

  // Example list of stocks
  const stocks = ["Apple", "Google", "Amazon", "Tesla", "Netflix"];

  const addStock = () => {
    if (selectedStock && !portfolio.includes(selectedStock)) {
      setPortfolio([...portfolio, selectedStock]);
      setSelectedStock(""); // reset dropdown
    }
  };

  return (
    <div style={{ border: "2px solid #333", padding: "20px", width: "300px", borderRadius: "8px" }}>
      <h3>My Portfolio</h3>
      
      <select 
        value={selectedStock} 
        onChange={(e) => setSelectedStock(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
      >
        <option value="">-- Choose a stock --</option>
        {stocks.map((stock, index) => (
          <option key={index} value={stock}>{stock}</option>
        ))}
      </select>

      <button onClick={addStock} style={{ width: "100%", padding: "5px" }}>Add to Portfolio</button>

      <ul style={{ marginTop: "15px" }}>
        {portfolio.map((stock, index) => (
          <li key={index}>{stock}</li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;
