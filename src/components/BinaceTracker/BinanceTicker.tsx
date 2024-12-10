import useBinanceWebSocket from "@/hooks/useWebSocket";
import { Box } from "@mui/material";
import React from "react";
import CandlestickChart from "../CandelStickyView/CandelChart";

const BinanceTicker: React.FC = () => {
  const candles = useBinanceWebSocket("btcusdt@kline_1m");

  const formattedData = React.useMemo(() => {
    return candles.map((kline) => ({
      t: kline.t, // Start time of the candle
      o: parseFloat(kline.o), // Open price
      h: parseFloat(kline.h), // High price
      l: parseFloat(kline.l), // Low price
      c: parseFloat(kline.c), // Close price
    }));
  }, [candles]);

  return (
    <div>
      <h1>Binance WebSocket - Ticker</h1>
      <Box>
        {/* Render the candlestick chart only if data exists */}
        {formattedData.length > 0 ? (
          <CandlestickChart data={formattedData} />
        ) : (
          <p>Loading chart...</p>
        )}
      </Box>
      {candles.length > 0 ? (
        <pre>{JSON.stringify(candles, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default BinanceTicker;
