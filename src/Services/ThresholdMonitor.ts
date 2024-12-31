type Mode = "EXCEEDED" | "RECOVERED" | "NONE";

export const ThresholdMonitor = function (
  threshold: number,
  duration: number,
  onExceed: () => void,
  onRecover: () => void
) {
  let highLoadStartTime: Date | undefined = undefined;
  let recoveryStartTime: Date | undefined = undefined;

  let currentMode: Mode;

  function update(value: number, time: Date) {
    const isDurationPassed = (duration: number, start: Date) =>
      time.getTime() - start.getTime() >= duration;

    if (value >= threshold) {
      recoveryStartTime = undefined;
      if (currentMode !== "EXCEEDED") {
        highLoadStartTime ??= time;
        if (isDurationPassed(duration, highLoadStartTime)) {
          onExceed();
          currentMode = "EXCEEDED";
        }
      }
    } else {
      highLoadStartTime = undefined;
      if (currentMode !== "RECOVERED") {
        recoveryStartTime ??= time;

        if (isDurationPassed(duration, recoveryStartTime)) {
          onRecover();
          currentMode = "RECOVERED";
        }
      }
    }
  }

  return {
    update,
  };
};
