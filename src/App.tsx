
import React, { useEffect, useState } from "react";
import './App.css';
import Stats from "./Components/CPULoadStats";
import CPULoadChart from "./Components/CPULoadChart";
import HeavyLoadSimulator from "./Components/HeavyLoadSimulator";
import { ThresholdMonitor } from "./Services/ThresholdMonitor";
import { FETCH_INTERVAL_SECONDS, HIGH_LOAD_THRESHOLD, LOAD_ALERT_THRESHOLD_MINUTES, TIME_WINDOW_MINUTES } from "./Constants";
import { notify, setupNotificationService } from "./Services/CPULoadNotifications";
import { getData } from "./Services/Data";
import { CpuLoad, MonitorHistory } from "./types";


const TIME_WINDOW = TIME_WINDOW_MINUTES * 60 * 1000; 
const FETCH_INTERVAL = FETCH_INTERVAL_SECONDS * 1000; 
const LOAD_ALERT_THRESHOLD = LOAD_ALERT_THRESHOLD_MINUTES * 60 * 1000; 

const isInTimeWindow = (data: CpuLoad) =>  new Date(data.time).getTime() >= new Date().getTime() - TIME_WINDOW;

const thresholdMonitor = ThresholdMonitor(HIGH_LOAD_THRESHOLD, LOAD_ALERT_THRESHOLD);

setupNotificationService();

export default function App() {

    const [loadData, setLoadData] = useState<CpuLoad[]>([]);
    const [currentLoad, setCurrentLoad] = useState<number>();
    const [monitorHistory, setMonitorHistory] = useState<MonitorHistory>({'EXCEEDED': [], 'RECOVERED': []});

    async function fetchData() {
      try {
        const data = await getData();
        setCurrentLoad(data.average)        
        setLoadData((prevData) => [...prevData.filter(isInTimeWindow), data]);
       
        const {currentMode, changed } = thresholdMonitor.check(data.average, new Date(data.time));
        if(changed){
            setMonitorHistory((prevData)=>({
              ...prevData,
              [currentMode]: [...prevData[currentMode], {time: new Date()}] 
            }));
            notify(currentMode);
        }

      } catch(error) {
        console.log('Could not fetch data.', error)
      }     
    }

    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, FETCH_INTERVAL);
      return () => clearInterval(intervalId);
    }, []);
    return (
        <div className="App">
            <div className="stats-container section"> 
              <HeavyLoadSimulator></HeavyLoadSimulator> 
              <Stats highLoadTimes = {monitorHistory.EXCEEDED} recoveryTimes={monitorHistory.RECOVERED} currentLoad={currentLoad} />
            </div>
            <div className="section chart-container" > 
              <CPULoadChart loadData={loadData}/>
            </div>
          </div>
    );
}




