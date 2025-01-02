import React from "react";
import * as dataService from "../data";
import { ThresholdMonitor } from "../ThresholdMonitor";
import * as notificationService from "../CPULoadNotifications";

// Mock dependencies
jest.mock("../data");
jest.mock("../ThresholdMonitor");
jest.mock("../CPULoadNotifications", () => ({
  notify: jest.fn(),
}));

jest.useFakeTimers();

describe("App Component", () => {
  const mockGetData = dataService.getData as jest.Mock;
  let mockThresholdMonitor = {
    check: jest.fn(),
  };
  const mockNotify = notificationService.notify as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockThresholdMonitor = {
      check: jest.fn(),
    };
  });

  it("should fetch data and update state", async () => {
    mockGetData.mockResolvedValueOnce({
      average: 75,
      time: new Date().toISOString(),
    });

    mockThresholdMonitor.check.mockReturnValue({
      currentMode: "RECOVERED",
      changed: true,
    });

    await jest.advanceTimersByTime(1000);

    expect(mockGetData).toHaveBeenCalled();
    expect(mockThresholdMonitor.check).toHaveBeenCalledWith(
      75,
      expect.any(Date)
    );
    expect(mockNotify).toHaveBeenCalledWith("RECOVERED");
  });

  it("should handle high load threshold exceeded", async () => {
    mockGetData.mockResolvedValueOnce({
      average: 95,
      time: new Date().toISOString(),
    });

    mockThresholdMonitor.check.mockReturnValue({
      currentMode: "EXCEEDED",
      changed: true,
    });

    await jest.advanceTimersByTime(1000);

    expect(mockThresholdMonitor.check).toHaveBeenCalledWith(
      95,
      expect.any(Date)
    );
    expect(mockNotify).toHaveBeenCalledWith("EXCEEDED");
  });

  it("should update monitor history when state changes", async () => {
    const time = new Date().toISOString();
    mockGetData.mockResolvedValueOnce({
      average: 95,
      time,
    });

    mockThresholdMonitor.check.mockReturnValue({
      currentMode: "EXCEEDED",
      changed: true,
    });

    await jest.advanceTimersByTime(1000);

    expect(mockNotify).toHaveBeenCalledWith("EXCEEDED");
  });
});
