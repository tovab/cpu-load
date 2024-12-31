import { ThresholdMonitor } from "../ThresholdMonitor";
describe("threshold monitor", () => {
  const threshold = 10;
  const duration = 2000;

  let onExceedMock: jest.Mock;
  let onRecoverMock: jest.Mock;

  beforeEach(() => {
    onExceedMock = jest.fn();
    onRecoverMock = jest.fn();
  });

  it("should call onExceed when threshold is exceeded for the specified duration", () => {
    const monitor = ThresholdMonitor(
      threshold,
      duration,
      onExceedMock,
      onRecoverMock
    );

    const initialTime = new Date();

    // First call: value exceeds threshold but duration not yet met
    monitor.update(15, initialTime);
    expect(onExceedMock).not.toHaveBeenCalled();

    // Second call: duration met
    const laterTime = new Date(initialTime.getTime() + 2000);
    monitor.update(15, laterTime);
    expect(onExceedMock).toHaveBeenCalledTimes(1);
  });

  it("should call onRecover when recovering for the specified duration", () => {
    const monitor = ThresholdMonitor(
      threshold,
      duration,
      onExceedMock,
      onRecoverMock
    );

    const initialTime = new Date();

    // Exceed the threshold
    monitor.update(15, initialTime);
    const exceedTime = new Date(initialTime.getTime() + 2000);
    monitor.update(15, exceedTime);

    // Drop below threshold
    const recoverStartTime = new Date(exceedTime.getTime() + 1000);
    monitor.update(5, recoverStartTime);

    // Recovery duration met
    const recoverEndTime = new Date(recoverStartTime.getTime() + 2000);
    monitor.update(5, recoverEndTime);
    expect(onRecoverMock).toHaveBeenCalledTimes(1);
  });

  it("should reset the exceed timer if value drops below threshold before duration is met", () => {
    const monitor = ThresholdMonitor(
      threshold,
      duration,
      onExceedMock,
      onRecoverMock
    );

    const initialTime = new Date();

    // Exceed the threshold briefly
    monitor.update(15, initialTime);

    // Drop below threshold before duration is met
    const shortTime = new Date(initialTime.getTime() + 1000);
    monitor.update(5, shortTime);

    // Exceed the threshold again
    const laterTime = new Date(shortTime.getTime() + 2000);
    monitor.update(15, laterTime);

    expect(onExceedMock).toHaveBeenCalledTimes(0);
  });

  it("should reset the recovery timer if value exceeds threshold again before recovery duration is met", () => {
    const monitor = ThresholdMonitor(
      threshold,
      duration,
      onExceedMock,
      onRecoverMock
    );

    const initialTime = new Date();

    // Exceed and recover partially
    monitor.update(15, initialTime);
    const exceedTime = new Date(initialTime.getTime() + 2000);
    monitor.update(15, exceedTime);

    // Drop below threshold
    const recoverStartTime = new Date(exceedTime.getTime() + 1000);
    monitor.update(5, recoverStartTime);

    // Exceed threshold again before recovery duration is met
    const exceedAgainTime = new Date(recoverStartTime.getTime() + 1000);
    monitor.update(15, exceedAgainTime);

    expect(onRecoverMock).not.toHaveBeenCalled();
  });

  it("should not call onExceed or onRecover if value fluctuates within the threshold duration", () => {
    const monitor = ThresholdMonitor(
      threshold,
      duration,
      onExceedMock,
      onRecoverMock
    );

    const initialTime = new Date();

    // Exceed threshold briefly
    monitor.update(15, initialTime);

    // Drop below threshold before duration met
    const shortTime = new Date(initialTime.getTime() + 1000);
    monitor.update(5, shortTime);

    // Exceed threshold again briefly
    const laterTime = new Date(shortTime.getTime() + 1000);
    monitor.update(15, laterTime);

    expect(onExceedMock).not.toHaveBeenCalled();
    expect(onRecoverMock).not.toHaveBeenCalled();
  });

  it("should not call onExceed if onrecover not called", () => {
    const monitor = ThresholdMonitor(
      threshold,
      duration,
      onExceedMock,
      onRecoverMock
    );

    const initialTime = new Date();

    // First call: value exceeds threshold but duration not yet met
    monitor.update(15, initialTime);
    expect(onExceedMock).not.toHaveBeenCalled();

    // Second call: duration met
    const laterTime = new Date(initialTime.getTime() + 2000);
    monitor.update(15, laterTime);

    // Third call: drop
    const thirdTime = new Date(initialTime.getTime() + 3000);
    monitor.update(15, thirdTime);

    // Third call: drop
    const fourthTime = new Date(initialTime.getTime() + 5000);
    monitor.update(15, fourthTime);
    expect(onExceedMock).toHaveBeenCalledTimes(1);
  });

  it("should onExceed again if onrecover was called", () => {
    const monitor = ThresholdMonitor(
      threshold,
      duration,
      onExceedMock,
      onRecoverMock
    );

    const initialTime = new Date();

    // First call: value exceeds threshold but duration not yet met
    monitor.update(15, initialTime);

    // Second call: duration met
    const laterTime = new Date(initialTime.getTime() + 2000);
    monitor.update(15, laterTime);

    // drop
    const thirdTime = new Date(initialTime.getTime() + 2500);
    monitor.update(5, thirdTime);

    // recover duration met
    const fourthTime = new Date(initialTime.getTime() + 5500);
    monitor.update(5, fourthTime);

    // exceed
    const fifthTime = new Date(initialTime.getTime() + 6000);
    monitor.update(15, fifthTime);

    // exceed duration met
    const sixthTime = new Date(initialTime.getTime() + 8000);
    monitor.update(15, sixthTime);

    expect(onExceedMock).toHaveBeenCalledTimes(2);
  });
});
