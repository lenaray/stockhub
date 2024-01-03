import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
from flask import request, render_template, jsonify, Flask
from alpha_vantage.timeseries import TimeSeries
from flask_cors import CORS

app = Flask(__name__, template_folder='templates')
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_stock_data', methods=['POST'])
def get_stock_data():
    ticker = request.get_json()['ticker']
    data = yf.Ticker(ticker).history(period='1y')
    return jsonify({'currentPrice': data.iloc[-1].Close, 'openPrice': data.iloc[-1].Open})

@app.route('/sample_data', methods=['GET'])
def sample_data():
    sample_ticker = 'MSFT'
    sample_data = yf.Ticker(sample_ticker).history(period='1y')
    
    # Extract relevant information
    current_price = sample_data.iloc[-1].Close
    open_price = sample_data.iloc[-1].Open

    # Print JSON response
    response_json = {'sampleTicker': sample_ticker, 'currentPrice': current_price, 'openPrice': open_price}
    print(response_json)

    return jsonify(response_json)

if __name__ == "__main__":
    app.run(debug=True)
