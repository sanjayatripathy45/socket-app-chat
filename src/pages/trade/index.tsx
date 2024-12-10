import BinanceTicker from "@/components/BinaceTracker/BinanceTicker";
import Header from "@/components/Header/Header";
import React from "react";


const Trade: React.FC = () => {
  return (
    <div>
         <Header/>
      <h1>Binance WebSocket Integration</h1>
      <BinanceTicker />
    </div>
  );
};

export default Trade;
