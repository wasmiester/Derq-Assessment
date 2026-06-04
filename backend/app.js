import { Pool } from "pg";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();

app.use(express.json());
app.use(cors());



export const con = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


//test
app.get("/api/test", async (req, res) => {
  try {
    let result = await con.query("SELECT * FROM traffic_metrics LIMIT 5;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Sum by country
app.get("/country", async (req, res) => {
  try {
    let result = await con.query(
      "SELECT country_code, SUM(traffic_vol) AS total_volume FROM traffic_metrics GROUP BY country_code;"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Sum by vehicle type
app.get("/vehicle", async (req, res) => {
  try {
    let result = await con.query(
      "SELECT vehicle_type, SUM(traffic_vol) AS vehicle_count FROM traffic_metrics GROUP BY vehicle_type;"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Traffic trends over time
app.get("/trends", async (req, res) => {
  try {
    let result = await con.query(
      "SELECT DATE_TRUNC('day', rec_time) AS time_stamp, SUM(traffic_vol) AS traff_volume FROM traffic_metrics GROUP BY time_stamp"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//add new
app.post("/traffic", async (req, res) => {
  const { country_code, vehicle_type, traffic_vol, rec_time } = req.body;
  try {
    await con.query(
      "INSERT INTO traffic_metrics (country_code, vehicle_type, traffic_vol, rec_time) VALUES ($1, $2, $3, $4)",
      [
        country_code.toUpperCase(),
        vehicle_type,
        parseInt(traffic_vol, 10),
        rec_time,
      ]
    );
    res.status(201).json({ message: "Traffic data added successfully" });
  } catch (err) {
    console.error("Database Insert Error Log:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/vehicle-types", async (req, res) => {
  try {
    let result = await con.query(
      "SELECT DISTINCT vehicle_type FROM traffic_metrics WHERE vehicle_type IS NOT NULL"
    );
    let typesArray = result.rows.map((row) => row.vehicle_type);
    res.json(typesArray);
  } catch (err) {
    console.error("Error fetching distinct vehicle types:", err);
    res.status(500).json({ error: "Database query failure." });
  }
});

export default app;
