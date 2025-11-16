from fastapi import FastAPI
import random
import pandas as pd
import pickle
from pathlib import Path
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
import yfinance as yf
import firebase_admin
from firebase_admin import credentials, db
import json
import numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VALID_TICKERS = [
    "AAPL", "MSFT", "GOOG", "AMZN", "FB", "NFLX", "NVDA", "INTC", "CSCO",
    "ORCL", "IBM", "HPQ", "ADBE", "CRM", "QCOM", "TXN", "AMD", "BIDU",
    "SBUX", "PYPL", "TSLA", "GILD", "AMAT", "MU", "AVGO", "LRCX"
]

CACHE_FILE = "stock_cache.pkl"
CACHE_MAX_AGE = timedelta(hours=24)
REQUIRED_FUTURE_DAYS = 10

historical_data = {}
aligned_data = None
news_data = None
news_by_date = {}
current_position = 0

def fetch_ticker_data(ticker):
    try:
        hist = yf.Ticker(ticker).history(period="max")['Close'].dropna()
        return ticker, hist
    except Exception as e:
        print(f"Error fetching {ticker}: {e}")
        return ticker, None

def load_historical_data():
    global historical_data
    
    cache_path = Path(CACHE_FILE)
    use_cache = False
    
    if cache_path.exists():
        cache_age = datetime.now() - datetime.fromtimestamp(cache_path.stat().st_mtime)
        if cache_age < CACHE_MAX_AGE:
            use_cache = True
    
    if use_cache:
        print("Loading stock data from cache...")
        with open(CACHE_FILE, 'rb') as f:
            historical_data = pickle.load(f)
        print("Cache loaded successfully")
    else:
        print("Downloading fresh stock data...")
        with ThreadPoolExecutor(max_workers=10) as executor:
            results = list(executor.map(fetch_ticker_data, VALID_TICKERS))
        
        historical_data = {ticker: hist for ticker, hist in results if hist is not None and len(hist) > 0}
        
        with open(CACHE_FILE, 'wb') as f:
            pickle.dump(historical_data, f)
        print(f"Downloaded and cached {len(historical_data)} tickers")

def get_available_tickers():
    global current_position, aligned_data
    
    if current_position + REQUIRED_FUTURE_DAYS >= len(aligned_data):
        return []
    
    available = []
    for ticker in aligned_data.columns:
        future_data = aligned_data[ticker].iloc[current_position:current_position + REQUIRED_FUTURE_DAYS + 1]
        if not future_data.isna().any() and len(future_data) == REQUIRED_FUTURE_DAYS + 1:
            available.append(ticker)
    
    return available

@app.on_event("startup")
def startup_event():
    global historical_data, aligned_data, news_data, news_by_date, current_position
    
    try:
        firebase_admin.get_app()
        print("Firebase already initialized")
    except ValueError:
        service_account_info = json.loads(os.environ["GOOGLE_CREDS"])
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://technica-842fc-default-rtdb.firebaseio.com/'
        })
        print("Firebase initialized")
    
    db.reference('/stocks').delete()

    load_historical_data()

    news_data = pd.read_csv("news.csv")
    
    print(f"News CSV columns: {list(news_data.columns)}")
    print(f"First row: {news_data.iloc[0].to_dict()}")
    
    date_col = None
    for col in news_data.columns:
        if 'date' in col.lower():
            date_col = col
            break
    
    if date_col is None:
        date_col = news_data.columns[2] if len(news_data.columns) > 2 else 'date'
    
    print(f"Using date column: {date_col}")
    
    news_data['date'] = pd.to_datetime(news_data[date_col], errors='coerce')
    news_data = news_data.dropna(subset=['date'])
    
    print(f"Parsed {len(news_data)} news items")
    print(f"Sample date: {news_data['date'].iloc[0]}")
    
    news_data['date_str'] = news_data['date'].astype(str)
    news_data['date_only'] = pd.to_datetime(news_data['date_str'].str[:10])
    
    actual_news_start = news_data['date_only'].min()
    actual_news_end = news_data['date_only'].max()
    print(f"News data spans: {actual_news_start.date()} to {actual_news_end.date()}")
    
    if actual_news_start.tz is not None:
        desired_start = pd.Timestamp('2009-01-01', tz=actual_news_start.tz)
        desired_end = pd.Timestamp('2011-12-31', tz=actual_news_start.tz)
    else:
        desired_start = pd.Timestamp('2009-01-01')
        desired_end = pd.Timestamp('2011-12-31')
    
    start_date = max(desired_start, actual_news_start)
    end_date = min(desired_end, actual_news_end)
    
    if start_date > end_date:
        print("No news in 2009-2011, using actual news date range instead")
        start_date = actual_news_start
        end_date = actual_news_start + pd.DateOffset(years=3)
        if end_date > actual_news_end:
            end_date = actual_news_end
    
    print(f"Using date range: {start_date.date()} to {end_date.date()}")
    
    news_data = news_data[(news_data['date_only'] >= start_date) & (news_data['date_only'] <= end_date)]
    
    print("Indexing news by date...")
    
    title_col = None
    for col in news_data.columns:
        if 'title' in col.lower():
            title_col = col
            break
    if title_col is None:
        title_col = news_data.columns[1]
    
    print(f"Using title column: {title_col}")
    
    news_by_date = {}
    for _, row in news_data.iterrows():
        date_key = row['date_only']
        if date_key not in news_by_date:
            news_by_date[date_key] = []
        news_by_date[date_key].append(row[title_col])
    
    print(f"Indexed {len(news_by_date)} unique dates with news")
    
    print("Aligning stock data across all tickers...")
    dfs = []
    for ticker in VALID_TICKERS:
        if ticker in historical_data and len(historical_data[ticker]) > 10:
            df = pd.DataFrame({ticker: historical_data[ticker]})
            dfs.append(df)
    
    if not dfs:
        raise Exception("No valid tickers found")
    
    aligned_data = dfs[0]
    for df in dfs[1:]:
        aligned_data = aligned_data.join(df, how='outer')
    
    aligned_data = aligned_data.ffill().bfill()
    
    aligned_data = aligned_data.dropna()
    
    aligned_data.index = pd.to_datetime(aligned_data.index)
    
    if actual_news_start.tz is not None:
        if aligned_data.index.tz is None:
            aligned_data.index = aligned_data.index.tz_localize(actual_news_start.tz)
        else:
            aligned_data.index = aligned_data.index.tz_convert(actual_news_start.tz)
    else:
        if aligned_data.index.tz is not None:
            aligned_data.index = aligned_data.index.tz_localize(None)
    
    mask = (aligned_data.index >= start_date) & (aligned_data.index <= end_date)
    aligned_data = aligned_data[mask]
    
    print(f"Stock data in date range: {len(aligned_data)} days")
    
    print("Filtering to only dates with news...")
    dates_with_news = set(news_by_date.keys())
    
    aligned_data_normalized = aligned_data.copy()
    aligned_data_normalized.index = aligned_data.index.normalize()
    
    mask = aligned_data_normalized.index.isin(dates_with_news)
    aligned_data = aligned_data[mask]
    
    print(f"Days with both stock data and news: {len(aligned_data)}")
    
    if len(aligned_data) < REQUIRED_FUTURE_DAYS + 1:
        raise Exception(f"Not enough aligned data. Only {len(aligned_data)} days found")
    
    max_start = len(aligned_data) - REQUIRED_FUTURE_DAYS - 1
    current_position = random.randint(0, max_start)
    
    print(f"Startup complete. {len(aligned_data)} aligned days available")
    print(f"Starting at position {current_position}, date {aligned_data.index[current_position].date()}")
    print(f"Available tickers: {list(aligned_data.columns)}")

@app.get("/top_stocks")
async def top_stocks():
    global current_position
    
    if current_position >= len(aligned_data):
        return {"error": "No more data available"}
    
    current_row = aligned_data.iloc[current_position]
    current_date = aligned_data.index[current_position]
    
    available_tickers = get_available_tickers()
    
    results = {ticker: float(current_row[ticker]) for ticker in available_tickers[:25]}
    
    return {"date": str(current_date.date()), "stocks": results}

@app.get("/add_stock/{ticker}/{amount}")
async def add_stock(ticker: str, amount: float):
    global current_position
    
    available_tickers = get_available_tickers()
    
    if ticker not in available_tickers:
        return {"status": "error", "message": "Ticker not valid or insufficient future data"}
    
    current_row = aligned_data.iloc[current_position]
    current_price = float(current_row[ticker])
    new_shares = amount / current_price
    
    ref = db.reference('/stocks')
    all_stocks = ref.get()
    
    existing_key = None
    if all_stocks:
        for key, stock in all_stocks.items():
            if stock.get("ticker") == ticker:
                existing_key = key
                break
    
    if existing_key:
        existing_stock = all_stocks[existing_key]
        old_shares = existing_stock.get("shares", 0)
        old_investment = existing_stock.get("initial_investment", 0)
        
        total_shares = old_shares + new_shares
        total_investment = old_investment + amount
        
        ref.child(existing_key).update({
            'shares': total_shares,
            'initial_investment': total_investment
        })
        
        return {
            "status": "success",
            "action": "accumulated",
            "ticker": ticker,
            "current_price": current_price,
            "new_shares": round(new_shares, 6),
            "total_shares": round(total_shares, 6),
            "invested_now": amount,
            "total_invested": total_investment
        }
    else:
        new_stock_ref = ref.push()
        new_stock_ref.set({
            'ticker': ticker,
            'price': current_price,
            'shares': new_shares,
            'initial_investment': amount
        })
        
        return {
            "status": "success",
            "action": "created",
            "ticker": ticker,
            "current_price": current_price,
            "shares": round(new_shares, 6),
            "invested": amount
        }

@app.get("/next_day")
async def next_day():
    global current_position
    
    if current_position >= len(aligned_data) - 1:
        return {"status": "error", "message": "No more days available"}
    
    previous_position = current_position
    current_position += 1
    
    current_date = aligned_data.index[current_position]
    current_row = aligned_data.iloc[current_position]
    previous_row = aligned_data.iloc[previous_position]
    
    ref = db.reference('/stocks')
    all_stocks = ref.get()
    
    user_stocks_changes = []
    
    if all_stocks:
        for key, stock in all_stocks.items():
            ticker = stock.get("ticker")
            old_price = stock.get("price")
            shares = stock.get("shares", 0)
            initial_investment = stock.get("initial_investment", 0)
            
            if ticker in aligned_data.columns:
                new_price = float(current_row[ticker])
                
                percent_change = 0.0
                if old_price and old_price > 0:
                    percent_change = ((new_price - old_price) / old_price) * 100
                
                current_value = new_price * shares
                total_gain_loss = current_value - initial_investment
                total_percent_change = 0.0
                if initial_investment > 0:
                    total_percent_change = (total_gain_loss / initial_investment) * 100
                
                ref.child(key).update({
                    "price": new_price,
                    "percent_change": percent_change,
                    "previous_price": old_price,
                    "current_value": current_value,
                    "total_gain_loss": total_gain_loss,
                    "total_percent_change": total_percent_change
                })
                
                user_stocks_changes.append({
                    "ticker": ticker,
                    "shares": shares,
                    "old_price": old_price,
                    "new_price": new_price,
                    "percent_change": round(percent_change, 2),
                    "current_value": round(current_value, 2),
                    "initial_investment": initial_investment,
                    "total_gain_loss": round(total_gain_loss, 2),
                    "total_percent_change": round(total_percent_change, 2)
                })
    
    available_tickers = get_available_tickers()
    all_stocks_changes = []
    
    for ticker in available_tickers:
        old_price = float(previous_row[ticker])
        new_price = float(current_row[ticker])
        
        percent_change = 0.0
        if old_price > 0:
            percent_change = ((new_price - old_price) / old_price) * 100
        
        all_stocks_changes.append({
            "ticker": ticker,
            "old_price": old_price,
            "new_price": new_price,
            "percent_change": round(percent_change, 2)
        })
    
    all_prices_ref = db.reference('/all_stock_prices')
    all_prices_ref.delete()
    
    for stock_data in all_stocks_changes:
        all_prices_ref.push(stock_data)
    
    return {
        "status": "success",
        "new_date": str(current_date.date()),
        "user_stocks": user_stocks_changes,
        "all_stocks": all_stocks_changes
    }

@app.get("/backtest")
async def backtest():
    return await next_day()

@app.get("/fetch_news")
async def fetch_news():
    current_date = aligned_data.index[current_position].normalize()
    
    news_items = news_by_date.get(current_date, [])
    
    return {"date": str(current_date.date()), "news": news_items}

@app.get("/refresh_cache")
async def refresh_cache():
    cache_path = Path(CACHE_FILE)
    if cache_path.exists():
        cache_path.unlink()
    load_historical_data()
    return {"status": "success", "message": "Cache refreshed"}

@app.get("/status")
async def status():
    if aligned_data is None:
        return {"status": "not initialized"}
    
    current_date = aligned_data.index[current_position]
    available_tickers = get_available_tickers()
    
    return {
        "current_position": current_position,
        "current_date": str(current_date.date()),
        "total_days": len(aligned_data),
        "days_remaining": len(aligned_data) - current_position,
        "available_tickers": available_tickers
    }