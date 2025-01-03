
import React, { useState } from 'react';
import "./HeavyLoadSimulator.css";
import Tooltip from './Tooltip';
import StressWorkerManager from '../Services/StressWorkerManager';

const HeavyLoadSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);

  async function startHighCpuUsage () {
    if ('serviceWorker' in navigator) {
      setIsRunning(true);
      StressWorkerManager.start();
    }
  };

  function stopHighCpuUsage() {
    StressWorkerManager.stop();
    setIsRunning(false);
  };

  return (
      <div>
        <div className="title">
          Test the load monitor  
          <Tooltip text="Press Start to run a process for every processor that is available to this browser."></Tooltip>   
        </div>
        <div>
          <button onClick={startHighCpuUsage} className="start" disabled={isRunning}> Start </button>      
          <button onClick={stopHighCpuUsage} className="stop"  disabled={!isRunning}> Stop </button>
        </div>
      </div>
  );
};

export default HeavyLoadSimulator;