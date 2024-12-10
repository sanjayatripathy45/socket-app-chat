import React, { useEffect, useRef } from "react";
import { createChart, ISeriesApi, UTCTimestamp } from "lightweight-charts";

interface CandlestickChartProps {
  data: {
    t: number; // Timestamp
    o: number; // Open
    h: number; // High
    l: number; // Low
    c: number; // Close
  }[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.offsetWidth,
      height: chartContainerRef.current.offsetHeight, // Use full container height
      layout: {
        // backgroundColor: "#000",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#404040" },
        horzLines: { color: "#404040" },
      },
    });

    // Add candlestick series
    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "#4caf50",
      downColor: "#f44336",
      borderVisible: false,
      wickUpColor: "#4caf50",
      wickDownColor: "#f44336",
    });

    // Cleanup
    return () => {
      chartRef.current?.remove();
    };
  }, []);

  // Update chart data when `data` prop changes
  useEffect(() => {
    if (seriesRef.current && data && data.length > 0) {
      // Sort data by timestamp in ascending order
      const sortedData = [...data].sort((a, b) => a.t - b.t);

      // Remove duplicates with the same timestamp
      const uniqueData = sortedData.filter((value, index, self) => {
        return index === 0 || value.t !== self[index - 1].t;
      });

      // Format the data
      const formattedData = uniqueData.map((candle) => ({
        time: (candle.t / 1000) as UTCTimestamp, // Convert to seconds
        open: candle.o,
        high: candle.h,
        low: candle.l,
        close: candle.c,
      }));

      seriesRef.current.setData(formattedData);
    }
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        position: "absolute",
        top: "50%", // Center vertically
        left: "50%", // Center horizontally
        transform: "translate(-50%, -50%)", // Offset the position to truly center it
        width: "80%", // 80% width of the screen
        height: "80vh", // 80% height of the screen
        border: "5px solid #fff", // White border
        borderRadius: "10px", // Rounded corners
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", // Soft shadow for better contrast
      
      }}
    />
  );
};

export default CandlestickChart;
