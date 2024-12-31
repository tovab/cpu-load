
import React, { useState } from 'react';
import "./HeavyLoadSimulator.css";
import Tooltip from './Tooltip';

const HeavyLoadSimulator = () => {
  const [workers, setWorkers] = useState<Worker[]>();
  const [isRunning, setIsRunning] = useState(false);

  const startHighCpuUsage = async () => {
    if (!workers?.length) {//do we need this
      if ('serviceWorker' in navigator) {
        const numCores = navigator.hardwareConcurrency;
        const newWorkers = [];

        for (let i = 0; i < numCores +1 ; i++) {
          const worker = new Worker("./CpuStressWorker.js");
          worker.postMessage('start')
          newWorkers.push(worker);
        }
        setWorkers(newWorkers);
        setIsRunning(true);

      }    
    }
  };

  const stopHighCpuUsage = () => {
    if (!workers) return; //error?
    workers.forEach((worker) => worker.terminate());
    setWorkers([]);
    setIsRunning(false);
    };

  return (
    <div className="container">
      <h2>CPU Stress Tester  
         <Tooltip text="Press Start to run a process for every processor that is available to this browser."></Tooltip> 
      </h2>
    
      <div>
        <button onClick={startHighCpuUsage} className="start" disabled={isRunning}> Start </button>      
        <button onClick={stopHighCpuUsage} className="stop"  disabled={!isRunning}> Stop </button>
      </div>
     
     
    </div>
  );
};

export default HeavyLoadSimulator;