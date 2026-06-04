import { useState, useEffect } from "react";
import {BarChart, Doughnut, Line } from "./Components";
import TrafficForm from "./TrafficForm";

const API_BASE_URL = "http://localhost:5000";

export default function App() {
  const [countData, setCountData] = useState([]);
  const [vData, setVData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [countryRes, vehicleRes, trendRes] = await Promise.all([
        fetch(`${API_BASE_URL}/country`),
        fetch(`${API_BASE_URL}/vehicle`),
        fetch(`${API_BASE_URL}/trends`),
      ]);

      setCountData(await countryRes.json());
      setVData(await vehicleRes.json());
      setTrendData(await trendRes.json());

    } catch (error) {
      console.error("Error getting data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <div
        style={{
          padding: "20px",
          margin: "0 auto",
          maxWidth: "1200px",
          fontFamily: "sans-serif",
          color: "black",
        }}
      >
        <h1>Traffic Dashboard</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            gap: "40px",
            marginTop: "30px",
          }}
        >
          <BarChart data={countData} />
          <Doughnut data={vData} />
        </div>

        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <Line data={trendData} />
        </div>
      </div>
      <TrafficForm newRecord={fetchDashboardData} />
    </>
  );
}
