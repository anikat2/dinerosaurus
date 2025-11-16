export async function getTopNews() {
  const res = await fetch("http://127.0.0.1:8000/fetch_news");
  if (!res.ok) throw new Error("Network response was not ok");
  const data = await res.json();
  const headlines = Array.from(new Set(data.news || []));
  return { date: data.date || "", headlines };
}

export async function getTopStocks() {
  const res = await fetch("http://127.0.0.1:8000/top_stocks");
  if (!res.ok) throw new Error("Network response was not ok");
  return await res.json();
}

export async function getBalance() {
  const res = await fetch("http://127.0.0.1:8000/current_balance");
  if (!res.ok) throw new Error("Network response was not ok");
  const data = await res.json();
  return data.total_balance ?? 0;
}

export async function buyStock(ticker, amount, sharesOrMoney, priceOfShare) {
  let payload = amount;
  if (sharesOrMoney === "Shares of Stock") {
    payload = amount * priceOfShare;
    sharesOrMoney = "Price (USD)"; // backend expects amount in USD
  }
  const res = await fetch(`http://127.0.0.1:8000/add_stock/${ticker}/${payload}`);
  return await res.json();
}

export async function sellStock(ticker, amount) {
  const res = await fetch(`http://127.0.0.1:8000/sell_stock/${ticker}/${amount}`);
  return await res.json();
}

export async function nextDay() {
  const res = await fetch("http://127.0.0.1:8000/next_day");
  return await res.json();
}