import React, { useEffect, useState } from "react";
import { fetchHistoricalData } from "../api/hello";
import CandlestickChart from "@/components/CandelStickyView/CandelChart";
import Header from "@/components/Header/Header";

const BinanceTicker: React.FC = () => {
  const [candles, setCandles] = useState<any[]>([]);

  useEffect(() => {
    const fetchCandles = async () => {
      const data = await fetchHistoricalData("BTCUSDT", "5m");
      setCandles(data);
    };
    fetchCandles();
  }, []);

  return (
    <div>
           <Header/>
      <h1 style={{textAlign:"center"}}>Binance Ticker</h1>
      {candles.length > 0 ? (
        <CandlestickChart data={candles} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BinanceTicker;
