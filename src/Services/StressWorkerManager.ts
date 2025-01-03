
const StressWorkerManager = (() => {
    const workers: Worker[] = [];
  
    function startWorkers() {
      if (workers.length > 0) return;
  
      const numCores = navigator.hardwareConcurrency;
      for (let i = 0; i < numCores + 2; i++) {
        const worker = new Worker("./CpuStressWorker.js");
        worker.postMessage("start");
        workers.push(worker);
      }
    }
  
    function stopWorkers() {
      workers.forEach((worker) => {
        worker.terminate()
      });
      workers.length = 0;
    }
  
    return {
      start: startWorkers,
      stop: stopWorkers,
    };
  })();
  
  export default StressWorkerManager;
  