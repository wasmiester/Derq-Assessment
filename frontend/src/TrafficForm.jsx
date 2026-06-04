import { useState, useEffect } from "react";


export default function TrafficForm({ newRecord }) {
  const [countCode, setCountryCode] = useState("");
  const [VList, setVList] = useState([]);
  const [vType, setVType] = useState("");
  const [volume, setVolume] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const apiUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${apiUrl}/vehicle-types`);
        if (!res.ok) throw new Error("Could not load types");
        const typesArray = await res.json();

        setVList(typesArray);

        if (typesArray.length > 0) {
          setVType(typesArray[0]);
        }
      } catch (err) {
        console.error("Failed to load dynamic selection types:", err);
      }
    };
    fetchTypes();
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    console.log("Submitting:", { countCode, vType, volume });
    const currentServerTime = new Date().toISOString();


    try {
      const res = await fetch(`${apiUrl}/traffic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country_code: countCode,
          vehicle_type: vType,
          traffic_vol: volume,
          rec_time: currentServerTime,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Submission failed");

      setStatus({ type: "success", text: "Metric successfully saved!" });
      setCountryCode("");
      setVolume("");

      if (newRecord) newRecord();
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        marginBottom: "20px",
        display: "grid",
        placeContent: "center",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Log Metric Entry</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>
            Country
          </label>
          <input
            type="text"
            maxLength="2"
            required
            placeholder="e.g. CA"
            value={countCode}
            onChange={(e) => setCountryCode(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #444",
              color: "#fff",
              backgroundColor: "#2d3748",
              width: "80px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Type</label>
          <select
            value={vType}
            onChange={(e) => setVType(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #444",
              color: "#fff",
              backgroundColor: "#2d3748",
              textTransform: "uppercase",
            }}
          >
            {VList.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label
            style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}
          >
            Volume
          </label>
          <input
            type="number"
            min="1"
            required
            placeholder="Count"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #444",
              color: "#fff",
              backgroundColor: "#2d3748",
              width: "100px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "9px 16px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#1a202c",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Submit!
        </button>
      </form>

      {status.text && (
        <div
          style={{
            fontSize: "13px",
            marginTop: "10px",
            color: status.type === "success" ? "green" : "red",
          }}
        >
          {status.text}
        </div>
      )}
    </div>
  );
}
