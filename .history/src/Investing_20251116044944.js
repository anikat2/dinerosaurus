import React, { useEffect, useState } from "react";
import { getTopNews, getTopStocks, buyStock, getBalance, sellStock, nextDay} from "./api/getInfo";
import Table from 'react-bootstrap/Table';
import "./Investing.css";

function Investing() {
  const [headlines, setHeadlines] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [tickers, setTickers] = useState({});
  const [buyOrSell, setBuyOrSell] = useState("");
  const [priceOrShares, setPriceOrShares] = useState("");
  const [stockInput, setStockInput] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const newsData = await getTopNews();
        setHeadlines(newsData.headlines || []);
        setDate(newsData.date || "");

        const stocksData = await getTopStocks();
        setTickers(stocksData.stocks || {});

        const bal = await getBalance();
        setBalance(bal); // Store the full balance object
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleNextDay = async () => {
    try {
      // Call the FastAPI next_day endpoint
      const data = await nextDay();

      if (data.status === "success") {
        // Update tickers table
        const stocksData = await getTopStocks();
        setTickers(stocksData.stocks || {});

        // Update news headlines for new date
        const newsData = await getTopNews();
        setHeadlines(newsData.headlines || []);
        setDate(newsData.date || "");

        // Update balance
        const bal = await getBalance();
        setBalance(bal);
      } else {
        alert(data.message || "No more days available");
      }
    } catch (err) {
      console.error("Error advancing to next day:", err);
    }
  };

  const handleExecute = async () => {
    if (!stockInput || !amount || !buyOrSell) {
      alert("Please fill out all fields");
      return;
    }

    if (!(stockInput in tickers)) {
      alert("Ticker not found in list.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Amount must be a positive number");
      return;
    }

    try {
      let result;
      if (buyOrSell === "buy") {
        result = await buyStock(stockInput, numericAmount, priceOrShares, tickers[stockInput]);
      } else if (buyOrSell === "sell") {
        result = await sellStock(stockInput, numericAmount);
      }

      if (result?.status === "error") {
        alert(result.message);
      } else {
        alert(`Success: ${JSON.stringify(result)}`);
      }

      const bal = await getBalance();
      setBalance(bal);
    } catch (err) {
      console.error("Error executing transaction:", err);
    }
  };

  if (loading) {
    return <p>Loading top news...</p>;
  }

  // Get display values from balance object
  const cashBalance = balance?.cash_balance || 0;
  const totalAccountValue = balance?.total_account_value || 0;
  const portfolioValue = balance?.portfolio_value || 0;

  return (
    <div>
      <h1>Investing</h1>
      {date && <p>Date: {date}</p>}

      <div className="both-tables-container">
        {/* News Table */}
        {headlines.length === 0 ? (
          <p>No headlines found.</p>
        ) : (
          <div className="table-container">
            <Table striped size="sm" style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px', width:'5%'}}>#</th>
                  <th style={{ border: '1px solid black', padding: '8px', width: '30%'}}>Headline</th>
                </tr>
              </thead>
              <tbody>
                {headlines.map((headline, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid black', padding: '8px', width:'5%' }}>{index + 1}</td>
                    <td style={{ border: '1px solid black', padding: '8px', width: '30%'}}>{headline}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Stock Table & Buy/Sell */}
        <div className="right-side">
          <div className="ticker-information">
            <Table striped size="sm" style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px', width:'5%'}}>Ticker</th>
                  <th style={{ border: '1px solid black', padding: '8px', width: '30%'}}>Stock Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tickers).map(([symbol, price]) => (
                  <tr key={symbol}>
                    <td style={{ border: '1px solid black', padding: '8px', width:'5%' }}>{symbol}</td>
                    <td style={{ border: '1px solid black', padding: '8px', width: '30%'}}>{price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Buy/Sell Controls */}
          <div
            className="buystocks-container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              width: "100%"
            }}
          >
            <span>I want to</span>

            <select
              id="buy-or-sell"
              value={buyOrSell}
              onChange={(e) => setBuyOrSell(e.target.value)}
              style={{ padding: "6px" }}
            >
              <option value="">Select</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>

            <input
              id="stock-input"
              placeholder="Stock"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              style={{ padding: "6px" }}
            />

            <span>in</span>

            {buyOrSell === "buy" && (
              <select
                id="stock-or-money"
                value={priceOrShares}
                onChange={(e) => setPriceOrShares(e.target.value)}
                style={{ padding: "6px" }}
              >
                <option value="">Select</option>
                <option value="Shares of Stock">Shares of Stock</option>
                <option value="Price (USD)">Price (USD)</option>
              </select>
            )}

            {buyOrSell === "sell" && (
              <select
                id="stock-or-money"
                value={priceOrShares}
                onChange={(e) => setPriceOrShares(e.target.value)}
                style={{ padding: "6px" }}
              >
                <option value="">Select</option>
                <option value="Shares of Stock">Shares of Stock</option>
              </select>
            )}

            <input
              id="amount-input"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ padding: "6px" }}
            />
          </div>

          <button onClick={handleExecute} style={{ padding: "6px 12px" }}>Execute</button>
          
          <div style={{ marginTop: "10px" }}>
            <h3>Account Summary</h3>
            <p><strong>Cash Balance:</strong> ${cashBalance.toFixed(2)}</p>
            <p><strong>Portfolio Value:</strong> ${portfolioValue.toFixed(2)}</p>
            <p><strong>Total Account Value:</strong> ${totalAccountValue.toFixed(2)}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Investing;