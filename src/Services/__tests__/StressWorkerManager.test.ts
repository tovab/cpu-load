import { EXTRA_PROCESSES } from "../StressWorkerManager";

jest.mock("../../../public/CpuStressWorker.js");

describe("StressWorkerManager Singleton", () => {
  let StressWorkerManager: typeof import("../StressWorkerManager").default;

  const numCores = 4;
  const numExpectedProcesses = numCores + EXTRA_PROCESSES;
  let worker: Worker;
  let terminate = jest.fn();
  let postMessage = jest.fn();

  beforeEach(() => {
    worker = {
      postMessage,
      terminate,
    } as unknown as Worker;

    global.Worker = jest.fn(() => worker);

    Object.defineProperty(navigator, "hardwareConcurrency", {
      value: numCores,
    });

    jest.resetModules();
    StressWorkerManager = require("../StressWorkerManager").default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create the correct number of workers", () => {
    StressWorkerManager.start();

    expect(global.Worker).toHaveBeenCalledTimes(numExpectedProcesses);
  });

  test("should post message to all workers when start is called", () => {
    StressWorkerManager.start();

    expect(postMessage).toHaveBeenCalledTimes(numExpectedProcesses);
  });

  test("should terminate all workers when stop is called", () => {
    StressWorkerManager.start();
    StressWorkerManager.stop();

    expect(terminate).toHaveBeenCalledTimes(numExpectedProcesses);
  });
});
