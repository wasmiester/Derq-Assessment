import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("pg", () => ({
  Pool: vi.fn(() => ({ query: vi.fn() })),
}));

import app, { con } from "./app.js";

describe("GET Endpoints", () => {
  it("routes for UI", async () => {
    con.query.mockResolvedValue({ rows: [] });

    const resTest = await request(app).get("/api/test");
    const resCountry = await request(app).get("/country");
    const resVehicle = await request(app).get("/vehicle");
    const resTrends = await request(app).get("/trends");
    const resVTypes = await request(app).get("/vehicle-types");

    expect(resTest.status).toBe(200);
    expect(resCountry.status).toBe(200);
    expect(resVehicle.status).toBe(200);
    expect(resTrends.status).toBe(200);
    expect(resVTypes.status).toBe(200);
  });


describe("POST endpoint", () => {
  const payload = {
    country_code: "us", //lowercase test to check uppercase parsing
    vehicle_type: "hatchback",
    traffic_vol: "5000", //string to check integer parsing
    rec_time: "2024-01-15T10:30:00.000Z",
  };

  it("Change payload to test different scenarios", async () => {
    con.query.mockResolvedValueOnce({ rowCount: 1 });
    const res = await request(app).post("/traffic").send(payload);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Traffic data added successfully");
  });
})});
