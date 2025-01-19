/**
 * The number of processes that should be run in order to stress the system,
 * in addition to the number of logical processors  available to the browser.
 * This should cause the average CPU load to rise to at least 1 quite consistently.
 * If not, this number should be increased.
 */
export const EXTRA_PROCESSES = 3;

const StressWorkerManager = (() => {
  const workers: Worker[] = [];

  function startWorkers() {
    if (workers.length > 0) return;

    const numCores = navigator.hardwareConcurrency;
    for (let i = 0; i < numCores + EXTRA_PROCESSES; i++) {
      const worker = new Worker("./CpuStressWorker.js");
      worker.postMessage("start");
      workers.push(worker);
    }
  }

  function stopWorkers() {
    workers.forEach((worker) => {
      worker.terminate();
    });
    workers.length = 0;
  }

  return {
    start: startWorkers,
    stop: stopWorkers,
  };
})();

export default StressWorkerManager;
