import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TrafficForm from "./TrafficForm";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();

  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ["CAR", "TRUCK", "VAN", "BIKE"],
  });
});

describe("TrafficForm ", () => {
  it("all test of data for data insertion", async () => {
    const user = userEvent.setup();
    const mockNewRecord = vi.fn();

    render(<TrafficForm newRecord={mockNewRecord} />);

    expect(screen.getByPlaceholderText("e.g. CA")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Count")).toBeInTheDocument();

    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(4));
    expect(screen.getByRole("option", { name: "CAR" })).toBeInTheDocument();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Traffic data added successfully" }),
    });

    const countryInput = screen.getByPlaceholderText("e.g. CA");
    const volumeInput = screen.getByPlaceholderText("Count");

    await user.type(countryInput, "US");
    await user.type(volumeInput, "5000");
    await user.selectOptions(screen.getByRole("combobox"), "CAR");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/traffic"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"country_code":"US"'),
        }),
      );
    });

    expect(screen.getByText(/metric successfully saved/i)).toBeInTheDocument();
    expect(countryInput).toHaveValue("");
    expect(volumeInput).toHaveValue(null);
    expect(mockNewRecord).toHaveBeenCalledTimes(1);
  });

  it("error handeling", async () => {
    const user = userEvent.setup();
    render(<TrafficForm />);

    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(4));

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Internal Server Error" }),
    });

    await user.type(screen.getByPlaceholderText("e.g. CA"), "CA");
    await user.type(screen.getByPlaceholderText("Count"), "1000");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument(),
    );
  });
});
