import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { getBalance } from "./api/getInfo";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TempEr({ currentBalance, setCurrentBalance, onPercentChange }) {
  const [portfolioData, setPortfolioData] = useState([]);
  const [latestPercentChange, setLatestPercentChange] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNextDay = async () => {
    setLoading(true);

    setPortfolioData(prev => [
      ...prev,
      { date: `Day ${prev.length + 1}`, percentChange: latestPercentChange }
    ]);

    try {
      const res = await fetch("http://localhost:8000/next_day");
      const json = await res.json();

      if (json.status === "success") {
        const totalPercent =
          json.user_stocks.length > 0
            ? json.user_stocks.reduce((sum, s) => sum + s.total_percent_change, 0) /
              json.user_stocks.length
            : 0;

        setPortfolioData(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            date: json.new_date,
            percentChange: totalPercent
          };
          return updated;
        });

        // ✅ Correctly fetch and set shared balance
        const newBalance = await getBalance();
        setCurrentBalance(newBalance["total_account_value"] || 0);

        setLatestPercentChange(totalPercent);
        onPercentChange(totalPercent);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>
        ${currentBalance.toFixed(2)}{" "}
        {latestPercentChange > 0 ? "▲" : latestPercentChange < 0 ? "▼" : ""}
      </h1>

      <div style={{ width: "60%", margin: "40px auto" }}>
        <Line
          data={{
            labels: portfolioData.map(d => d.date),
            datasets: [
              {
                label: "Portfolio % Change",
                data: portfolioData.map(d => d.percentChange),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.3
              }
            ]
          }}
          options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
        />
      </div>

      <button
        onClick={handleNextDay}
        disabled={loading}
        style={{ padding: "12px 20px", fontSize: "20px" }}
      >
        {loading ? "..." : "Next Day"}
      </button>

      <button
        onClick={() => {
          setLatestPercentChange(-5);
          onPercentChange(-5);
        }}
        style={{ marginLeft: "20px", padding: "12px 20px", fontSize: "20px" }}
      >
        Test -5%
      </button>
    </div>
  );
}
