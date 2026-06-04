import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

vi.mock("./Components", () => ({
  BarChart: vi.fn(() => null),
  Doughnut: vi.fn(() => null),
  Line: vi.fn(() => null),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockDashboardPayload = () => {
  mockFetch.mockImplementation((url) => {

    if (url.includes("/vehicle-types"))
      return Promise.resolve({ ok: true, json: async () => ["sedan", "truck", "van"] });

    if (url.includes("/country"))
      return Promise.resolve({ ok: true, json: async () => [{ country_code: "US", total_volume: 100 }] });
    
    if (url.includes("/vehicle"))
      return Promise.resolve({ ok: true, json: async () => [{ vehicle_type: "Car", vehicle_count: 50 }] });
    
    if (url.includes("/trends"))
      return Promise.resolve({ ok: true, json: async () => [{ time_stamp: "2026-06-03", traff_volume: 1000 }] });
    return Promise.resolve({ ok: true, json: async () => [] });
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  mockDashboardPayload();
});

describe("App Dashboard Integration", () => {
  it("see if data for dashboard loads correctly", async () => {
    render(<App />);

    expect(screen.getByText("Traffic Dashboard")).toBeInTheDocument();

    await waitFor(() => {
      const calledUrls = mockFetch.mock.calls.map(([url]) => url);
      expect(calledUrls.some(u => u.includes("/country"))).toBe(true);
      expect(calledUrls.some(u => u.includes("/vehicle"))).toBe(true);
      expect(calledUrls.some(u => u.includes("/trends"))).toBe(true);
    });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(4));
  });
});
