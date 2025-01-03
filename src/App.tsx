import React, { useCallback, useEffect, useState } from "react";
import Stats from "./Components/CPULoadStats";
import CPULoadChart from "./Components/CPULoadChart";
import HeavyLoadSimulator from "./Components/HeavyLoadSimulator";
import { ThresholdMonitor } from "./Services/ThresholdMonitor";
import { FETCH_INTERVAL_SECONDS, HIGH_LOAD_THRESHOLD, LOAD_THRESHOLD_MINUTES, LOAD_HISTORY_TIME_WINDOW_MINUTES } from "./Constants";
import { setupNotificationService } from "./Services/CPULoadNotifications";
import { getData } from "./Services/Data";
import { CpuLoad, MonitorHistory } from "./types";
import { ToastContainer } from "react-toastify";
import './App.css';

const TIME_WINDOW = LOAD_HISTORY_TIME_WINDOW_MINUTES * 60 * 1000; 
const FETCH_INTERVAL = FETCH_INTERVAL_SECONDS * 1000; 
const LOAD_ALERT_THRESHOLD = LOAD_THRESHOLD_MINUTES * 60 * 1000; 

const isInTimeWindow = (data: CpuLoad) =>  new Date(data.time).getTime() >= new Date().getTime() - TIME_WINDOW;

const thresholdMonitor = ThresholdMonitor(HIGH_LOAD_THRESHOLD, LOAD_ALERT_THRESHOLD);

const { notify } = await setupNotificationService();

type AppState = {
    loadData: CpuLoad[];
    currentLoad: number | undefined;
    monitorHistory: MonitorHistory;
}

export default function App() {

  const [state, setState] = useState<AppState>({
    loadData: [],
    currentLoad: undefined,
    monitorHistory: { EXCEEDED: [], RECOVERED: [] }
  });

    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        
        const {currentMode, changed } = thresholdMonitor.check(data.average, new Date(data.time));
        if(changed){
          notify(currentMode);
        }
        setState((prevState) => {
          return {
              ...prevState,
              currentLoad: data.average,
              loadData: [ ...prevState.loadData.filter(isInTimeWindow), data ],
              monitorHistory: changed ? {
                ...prevState.monitorHistory,
                [currentMode]: [
                  ...prevState.monitorHistory[currentMode],
                  { time: new Date() }
                ]
              } : {...prevState.monitorHistory}
    
          }
      });

      } catch(error) {
        console.log('Could not fetch data.', error)
      }     
    };
    fetchData();
    const intervalId = setInterval(fetchData, FETCH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);
  return (
      <div className="App">
          <ToastContainer />
          <div className="stats-container section"> 
            <HeavyLoadSimulator /> 
            <Stats highLoadTimes = {state.monitorHistory.EXCEEDED} recoveryTimes={state.monitorHistory.RECOVERED} currentLoad={state.currentLoad} />
          </div>
          <div className="section chart-container" > 
            <CPULoadChart loadData={state.loadData}/>
          </div>
        </div>
  );
}




