import axios from "axios";
import React, { useContext, useState, useEffect, createContext, ReactNode } from "react";
import { TIME_WINDOW_MINUTES, FETCH_INTERVAL_SECONDS, LOAD_ALERT_THRESHOLD_MINUTES, HIGH_LOAD_THRESHOLD } from './config';
import { ThresholdMonitor } from './Services/ThresholdMonitor';
import { alertExceeded, notifyRecovered } from './Services/CPULoadNotifications';


 type CpuLoad = {
  average: number, time: Date
}

const LOAD_API = 'http://localhost:3001/cpuLoadAverage';

const TIME_WINDOW = TIME_WINDOW_MINUTES * 60 * 1000; 
const FETCH_INTERVAL = FETCH_INTERVAL_SECONDS * 1000; 
const LOAD_ALERT_THRESHOLD = LOAD_ALERT_THRESHOLD_MINUTES * 60 * 1000; 

type MonitorData = {
  time: Date
}
type APIContextType = {
  loadData?: CpuLoad[];
  highLoadTimes?: MonitorData[];
  currentLoad?: number;
  recoveryTimes?: MonitorData[];
};

const APIContext = createContext<APIContextType>({});


type Props = {
  children: ReactNode
}
export function APIContextProvider({ children }: Props) {

 

  const thresholdMonitor = ThresholdMonitor(HIGH_LOAD_THRESHOLD, LOAD_ALERT_THRESHOLD, onExceed, onRecover);

    const [loadData, setLoadData] = useState<CpuLoad[]>([]);
    const [currentLoad, setCurrentLoad] = useState<number>();
    const [highLoadTimes, setHighLoadTimes] = useState<MonitorData[]>([]);
    const [recoveryTimes, setRecoveryTimes] = useState<MonitorData[]>([]);

    function onExceed(){
      setHighLoadTimes((prevData)=>[...prevData, {time: new Date()}] );
      alertExceeded();
    }
  
    function onRecover(){
      setRecoveryTimes((prevData)=>[...prevData, {time: new Date()}] );
      notifyRecovered();
    }
    async function fetchData() {
      try {
        const {data} = await axios.get<CpuLoad>(LOAD_API);
        thresholdMonitor.update(data.average, new Date(data.time));
        setCurrentLoad(data.average)        
        setLoadData((prevData) => [...prevData.filter((data: CpuLoad)  => new Date(data.time).getTime() >= new Date().getTime() - TIME_WINDOW), data]);
      } catch(error) {
        console.log('Could not fetch data.', error)
      }     
    }
    const contextData = { loadData, currentLoad, highLoadTimes, recoveryTimes };

    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, FETCH_INTERVAL);
      return () => clearInterval(intervalId);
    });
    return (
      <APIContext.Provider value={contextData} >
        {children}
      </APIContext.Provider>
    );
}

export function useAPI() {
  return useContext(APIContext);
}
