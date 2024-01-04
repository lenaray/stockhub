import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './vite.svg'
import './App.css'
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [submittedValues, setSubmittedValue] = useState([]);
  const [hoveredTicker, setHoveredTicker] = useState(null);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [tickerData, setTickerData] = useState(null);
  const [tickerName, setTickerName] = useState(null);
  const [tickerHistory, setTickerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  useEffect(() => {
      console.log(showGraph);
  }, [showGraph]);

  const calculatePercentageChange = (openPrice, closePrice) => {
      if (openPrice === 0) {
          return 0;
      }
      return ((closePrice - openPrice) / openPrice) * 100;
  };

  const fetchGraphData = (ticker, startDate, endDate) => {
    setLoading(true);
    const API_KEY = 'Dok1CpSQK9Wnjg8G05oP2L_nAwKkKSkl';
    let API_Call = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2023-01-02/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`;
    fetch(API_Call)
        .then(
            function(response) {
                return response.json();
            }
        ).then(
            function(data) {
                console.log(data);
                if (data.status === "OK") {
                    const closingPrices = data.results.map(result => result.c);
                    console.log("Closing Prices:", closingPrices);
                    setTickerHistory({ closingPrices });
                } else {
                    console.error("Error fetching graph data:", data.status);
                }
            })
            .finally(() => {
                setLoading(false);
            })
  }

  useEffect(() => {
      console.log("Updated tickerHistory", tickerHistory);
  }, [tickerHistory]);

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
      if (showGraph) {
        setShowGraph(false);
    }
    
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

  const handleGraphToggle = async (ticker) => {
    if (showGraph) {
        setTickerHistory([]);
    } else {
        fetchGraphData(ticker, startDate, endDate);
    }
    setShowGraph(!showGraph);
    // const closingPrices = await fetchGraphData(ticker);
    // setTickerHistory(closingPrices);
  }

  const handleStartDateChange = (date) => {
      setStartDate(date);
      console.log("Selected Start Date:", date);
  }

  const handleEndDateChange = (date) => {
      setEndDate(date);
      console.log("Selected End Date:", date);
  }

  const handleApplyFilter = () => {
      const today = new Date();
      const defaultEndDate = today.toISOString().split('T')[0];
      const defaultStartDate = new Date(today);
      defaultStartDate.setDate(today.getDate() - 7);
      const formattedStartDate = defaultStartDate.toISOString().split('T')[0];

      const selectedStartDate = startDate ? startDate.toISOString().split('T')[0] : formattedStartDate;
      const selectedEndDate = endDate ? endDate.toISOString().split('T')[0] : defaultEndDate;

      fetchGraphData(selectedStartDate, selectedEndDate);
  }

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
      <div className = "container">
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
                                        <button className="expand-button" onClick={() => handleGraphToggle(ticker)}>&#9658;</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    )}
                </div>
            ))}
            </div>
            {showGraph && (
                <div className="chart-container">
                    <div className="date-filter">
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Start Date"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="End Date"
                        />
                        <button>Apply Filter</button>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                            <Line
                            data={{
                                labels:['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                                datasets: [
                                    {
                                        label: 'Closing Price',
                                        data: tickerHistory.closingPrices,
                                        fill: false,
                                        borderColor: 'rgba(75,192,192,1)',
                                        lineTension: 0.1,
                                    },
                                ],
                            }}
                            />
                    )}
                </div>
            )}
        </div>
    </>
  );
}

export default App
