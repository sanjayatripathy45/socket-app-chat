import { fetchHistoricalData } from "@/pages/api/hello";
import { useEffect, useRef, useState } from "react";

interface Kline {
  t: number; // Start time of the candle
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  c: string; // Close price
  v: string; // Volume
}

interface KlineStreamData {
  k: Kline; // Kline object
}

const useBinanceWebSocket = (symbol: string) => {
  const [candles, setCandles] = useState<Kline[]>([]);
  useEffect(() => {
    const fetchCandles = async () => {
      const data = await fetchHistoricalData("BTCUSDT", "5m");
      setCandles(data);
    };
    fetchCandles();
  }, []);


  useEffect(() => {
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}`);

    socket.onmessage = (event) => {
      const message: KlineStreamData = JSON.parse(event.data);
      const kline = message.k;


      setCandles((prevCandles) => {
        const updatedCandles = [...prevCandles];
        const lastCandle = updatedCandles[updatedCandles.length - 1];

        // if (lastCandle && lastCandle.t === kline.t) {
        //   // Update the last candle if it's the same interval
        //   updatedCandles[updatedCandles.length - 1] = kline;
        // } else {
          // Add a new candle
          updatedCandles.push(kline);
        // }

        // Adjust to show more candles (e.g., keep the latest 500 candles)
        const maxCandles = 500;
        return updatedCandles.slice(-maxCandles);
      });
    };

    // Clean up the WebSocket connection on unmount
    return () => socket.close();
  }, [symbol]);

  return candles;
};

export default useBinanceWebSocket;
