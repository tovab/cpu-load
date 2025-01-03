import { MonitorMode } from "../../types";
import { ThresholdMonitor } from "../ThresholdMonitor";

describe("ThresholdMonitor", () => {
  const threshold = 1;
  const duration = 2000;

  let monitor: {
    check: (
      value: number,
      time: Date
    ) => { changed: boolean; currentMode: MonitorMode };
  };

  beforeEach(() => {
    monitor = ThresholdMonitor(threshold, duration);
  });

  it("should initialize with undefined mode and not change initially", () => {
    const result = monitor.check(threshold / 2, new Date());
    expect(result.changed).toBe(false);
    expect(result.currentMode).toBeUndefined();
  });

  it("should not exceed threshold if value is below threshold", () => {
    const startTime = new Date();
    const result = monitor.check(threshold / 2, startTime);
    expect(result.changed).toBe(false);
    expect(result.currentMode).toBeUndefined();
  });

  it("should switch to 'exceeded' if value exceeds threshold for duration", () => {
    const startTime = new Date();
    monitor.check(threshold + 1, startTime);

    const result = monitor.check(
      threshold + 1,
      new Date(startTime.getTime() + duration)
    );
    expect(result.changed).toBe(true);
    expect(result.currentMode).toBe("EXCEEDED");
  });

  it("should not switch to 'exceeded' if value is above threshold but duration has not passed", () => {
    const startTime = new Date();
    monitor.check(threshold + 1, startTime);

    const result = monitor.check(
      threshold + 1,
      new Date(startTime.getTime() + duration - 1000)
    );
    expect(result.changed).toBe(false);
    expect(result.currentMode).toBeUndefined();
  });

  it("should not return 'exceeded' if value was under the threshold during the duration even if it goes back up", () => {
    const startTime = new Date();
    monitor.check(threshold + 1, startTime);

    monitor.check(threshold / 2, new Date(startTime.getTime() + 1000));

    const result = monitor.check(
      threshold + 1,
      new Date(startTime.getTime() + 2001)
    );
    expect(result.changed).toBe(false);
    expect(result.currentMode).toBeUndefined();
  });

  it("should change to 'recovered' state if value is below threshold for duration", () => {
    const startTime = new Date();

    //exceed
    monitor.check(threshold + 1, startTime);
    monitor.check(threshold + 1, new Date(startTime.getTime() + duration));

    //recover
    const recoveryStart = new Date(startTime.getTime() + duration + 1000);
    monitor.check(threshold / 2, recoveryStart);
    const result = monitor.check(
      threshold / 2,
      new Date(recoveryStart.getTime() + duration)
    );

    expect(result.changed).toBe(true);
    expect(result.currentMode).toBe("RECOVERED");
  });

  it("should not switch to 'recovered' if value is below threshold but duration has not passed", () => {
    const startTime = new Date();

    //exceed
    monitor.check(threshold + 1, startTime);
    monitor.check(threshold + 1, new Date(startTime.getTime() + duration));

    //recover
    const recoveryStart = new Date(startTime.getTime() + duration + 1000);
    const result = monitor.check(
      threshold / 2,
      new Date(recoveryStart.getTime() + duration - 1000)
    );

    expect(result.changed).toBe(false);
    expect(result.currentMode).toBe("EXCEEDED");
  });

  it("should not be in recovered mode if did not exceed", () => {
    const startTime = new Date();
    monitor.check(threshold / 2, new Date());
   
    const result = monitor.check(
      threshold / 2,
      new Date(startTime.getTime() + duration)
    );
    expect(result.changed).toBe(false);
    expect(result.currentMode).toBeUndefined();
  });
});
