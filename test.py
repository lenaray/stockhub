import yfinance as yf
import pandas as pd

data = yf.Ticker("MSFT").history(period='1y')
print(data.iloc[-1].Close)

# tickers_list = ["aapl", "goog", "amzn", "BAC", "BA"]
# tickers_data = {}

# for ticker in tickers_list:
#     ticker_object = yf.Ticker(ticker)

#     temp = pd.DataFrame.from_dict(ticker_object.info, orient="index")
#     temp.reset_index(inplace=True)
#     temp.columns = ["Attribute", "Recent"]

#     tickers_data[ticker] = temp

# print(tickers_data)