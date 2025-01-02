import { MonitorMode } from "../types";

/** Handles the change of state of going above and below a threshold over a period of time. */
export const ThresholdMonitor = function (threshold: number, duration: number) {
  let highLoadStartTime: Date | undefined = undefined;
  let recoveryStartTime: Date | undefined = undefined;

  let currentMode: MonitorMode;

  const isDurationPassed = (duration: number, start: Date, time: Date) =>
    time.getTime() - start.getTime() >= duration;

  function check(
    value: number,
    time: Date
  ): { changed: boolean; currentMode: MonitorMode } {
    if (value >= threshold) {
      recoveryStartTime = undefined;
      if (currentMode === "EXCEEDED") return { changed: false, currentMode };

      highLoadStartTime ??= time;
      if (isDurationPassed(duration, highLoadStartTime, time)) {
        currentMode = "EXCEEDED";
        return { changed: true, currentMode };
      }
      return { changed: false, currentMode };
    }

    highLoadStartTime = undefined;
    if (currentMode === "RECOVERED") {
      return { changed: false, currentMode };
    }
    recoveryStartTime ??= time;

    if (isDurationPassed(duration, recoveryStartTime, time)) {
      currentMode = "RECOVERED";
      return { changed: true, currentMode };
    }
    return { changed: false, currentMode };
  }

  return {
    check,
  };
};
