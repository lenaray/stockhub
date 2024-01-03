import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './vite.svg'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('');
  const [submittedValues, setSubmittedValue] = useState([]);
  const [hoveredTicker, setHoveredTicker] = useState(null);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [tickerData, setTickerData] = useState(null);
  const [tickerName, setTickerName] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
      setInputValue(e.target.value);
  };

  // TOZRELWV9WFJ4VBM

  const fetchData = (ticker) => {
      setLoading(true);
      const API_KEY = 'Dok1CpSQK9Wnjg8G05oP2L_nAwKkKSkl';
      let API_Call = `https://api.polygon.io/v1/open-close/${ticker}/2023-01-09?adjusted=true&apiKey=${API_KEY}`;
      return fetch(API_Call).then((response) => response.json());
  }

  const fetchName = (ticker) => {
    setLoading(true);
    const API_KEY = 'Dok1CpSQK9Wnjg8G05oP2L_nAwKkKSkl';
    let API_Call = `https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&active=true&apiKey=${API_KEY}`;
    return fetch(API_Call).then((response) => response.json());
  }

  useEffect(() => {
      setLoading(false);
  }, [tickerData, tickerName]);

  useEffect(() => {
      console.log('Updated tickerData', tickerData);
  }, [tickerData]);

  useEffect(() => {
    }, [hoveredTicker]);

  const calculatePercentageChange = (openPrice, closePrice) => {
      if (openPrice === 0) {
          return 0;
      }
      return ((closePrice - openPrice) / openPrice) * 100;
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      setSubmittedValue((prevValues) => [...prevValues, inputValue]);
      setInputValue('');
  };

  const handleHover = (ticker) => {
    console.log(`Hovered on ticker: ${ticker}`);
    setHoveredTicker(ticker);
    // handleFetchData(ticker);
  };

  const handleTickerClick = async (ticker) => {
      setSelectedTicker(ticker);
      try {
          const[data, nameData] = await Promise.all([fetchData(ticker), fetchName(ticker)]);
          const mostRecentOpenPrice = data['open'];
          const mostRecentClosePrice = data['close'];
          setTickerData({ ticker, mostRecentOpenPrice, mostRecentClosePrice });

          const name = nameData.results[0].name;
          setTickerName({ name });
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  return (
    <>
      <h1 className="header">StockHub</h1>
      <form onSubmit={handleSubmit} className="input">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter ticker name"
            className="value"
            />
            <button type="submit" className="button">Add</button>
      </form>
      <div className="ticker-grid">
        {submittedValues.map((ticker, index) => (
            <div
                key={index}
                className={`ticker-box ${hoveredTicker === ticker ? 'hovered' : ''}`}
                onMouseOver={() => handleHover(ticker)}
                onClick={() => handleTickerClick(ticker)}
                >
                <div>{ticker}</div>
                {selectedTicker === ticker && (
                <div className="additional-content">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {tickerData && (
                                <>
                                    <p>{tickerName.name}</p>
                                    <p>Current Price: {tickerData.mostRecentOpenPrice}</p>
                                    <p>Open Price: {tickerData.mostRecentClosePrice}</p>
                                    <p>
                                        Percentage Change:{' '}
                                        {calculatePercentageChange(
                                            tickerData.mostRecentOpenPrice,
                                            tickerData.mostRecentClosePrice
                                        ).toFixed(2)}%
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </div>
                )}
            </div>
        ))}
      </div>
    </>
  );
}

export default App
