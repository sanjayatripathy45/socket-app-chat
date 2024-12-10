import axios from "axios";

// Define a function to fetch historical candlestick data
const fetchHistoricalData = async (symbol: string, interval: string) => {
  const endTime = Date.now(); // Current time in milliseconds
  const startTime = endTime - 365 * 24 * 60 * 60 * 1000; // One month ago (30 days)

  try {
    const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol,
        interval,
        startTime,
        endTime,
        limit: 1000, // You can adjust the limit based on the data you're fetching
      },
    });

    // Format the response data
    const formattedData = response.data.map((candle: any) => ({
      t: candle[0], // Timestamp
      o: parseFloat(candle[1]), // Open price
      h: parseFloat(candle[2]), // High price
      l: parseFloat(candle[3]), // Low price
      c: parseFloat(candle[4]), // Close price
      v: parseFloat(candle[5]), // Volume
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return [];
  }
};

// Usage Example
const symbol = "BTCUSDT"; // The symbol you're interested in
const interval = "5m"; // The interval (e.g., 1m, 5m, 1h, etc.)
fetchHistoricalData(symbol, interval).then((data) => {
  console.log("Historical Data:", data);
});
