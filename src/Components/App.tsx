
import React, { useEffect, useState } from "react";
import './App.css';
import Stats from "./LoadStats";
import LoadChart from "./LoadChart";
import HeavyLoadSimulator from "./HeavyLoadSimulator";
import { ThresholdMonitor } from "../Services/ThresholdMonitor";
import { FETCH_INTERVAL_SECONDS, HIGH_LOAD_THRESHOLD, LOAD_ALERT_THRESHOLD_MINUTES, TIME_WINDOW_MINUTES } from "../config";
import { notify } from "../Services/CPULoadNotifications";
import { getData } from "../Services/data";
import { CpuLoad, MonitorHistory } from "../types";


const TIME_WINDOW = TIME_WINDOW_MINUTES * 60 * 1000; 
const FETCH_INTERVAL = FETCH_INTERVAL_SECONDS * 1000; 
const LOAD_ALERT_THRESHOLD = LOAD_ALERT_THRESHOLD_MINUTES * 60 * 1000; 


const thresholdMonitor = ThresholdMonitor(HIGH_LOAD_THRESHOLD, LOAD_ALERT_THRESHOLD);

export default function App() {

    const [loadData, setLoadData] = useState<CpuLoad[]>([]);
    const [currentLoad, setCurrentLoad] = useState<number>();
    const [monitorHistory, setMonitorHistory] = useState<MonitorHistory>({'EXCEEDED': [], 'RECOVERED': []});

    async function fetchData() {
      try {
        const data = await getData();
        setCurrentLoad(data.average)        
        setLoadData((prevData) => [...prevData.filter((data: CpuLoad)  => new Date(data.time).getTime() >= new Date().getTime() - TIME_WINDOW), data]);
       
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
            <div className="section"> 
              <HeavyLoadSimulator></HeavyLoadSimulator> 
              <Stats highLoadTimes = {monitorHistory.EXCEEDED} recoveryTimes={monitorHistory.RECOVERED} currentLoad={currentLoad} />
            </div>
            <div className="section chart-container" > 
              <LoadChart loadData={loadData}/>
            </div>
          </div>
    );
}




