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
      highLoadStartTime ??= time;

      if (
        currentMode === "EXCEEDED" ||
        !isDurationPassed(duration, highLoadStartTime, time)
      ) {
        return { changed: false, currentMode };
      }
      currentMode = "EXCEEDED";
      return { changed: true, currentMode };
    }
    //under threshold:
    highLoadStartTime = undefined;
    recoveryStartTime ??= time;

    if (
      currentMode === "RECOVERED" ||
      !isDurationPassed(duration, recoveryStartTime, time)
    ) {
      return { changed: false, currentMode };
    }

    currentMode = "RECOVERED";
    return { changed: true, currentMode };
  }

  return {
    check,
  };
};
