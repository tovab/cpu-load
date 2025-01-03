
import React from 'react';
import "./CPULoadStats.css";
import { HIGH_LOAD_THRESHOLD, LOAD_ALERT_THRESHOLD_MINUTES } from '../Constants';
import Tooltip from './Tooltip';
import { MonitorData } from '../types';

type Stats = {
  highLoadTimes?: MonitorData[];
  recoveryTimes?: MonitorData[];
  currentLoad?: number;
}

function displayTime(time: Date){
  return time.toLocaleDateString() + " " +  time.toLocaleTimeString();
}
const CPULoadStats = (props: Stats) => {

    const highLoadTimes = props.highLoadTimes?.map(item => <li key={item.time.getTime()}>{displayTime(item.time)}</li>);
    const recoveryTimes = props.recoveryTimes?.map(item => <li key={item.time.getTime()}>{displayTime(item.time)}</li>);

   return (
    <div className="container">
      <div className="stats">
        <div className="stat">
          <h2>Current CPU Load</h2>
          <span className='stat-number'>{props.currentLoad?.toFixed(2)}</span>        
        </div>
        <div className="stat">
          <h2>
            Heavy CPU Load
            <Tooltip text={`At or above ${HIGH_LOAD_THRESHOLD} for at least ${LOAD_ALERT_THRESHOLD_MINUTES} minutes`}></Tooltip>
          </h2>
          <p>Occurrences: <span className="stat-number">{highLoadTimes?.length}</span></p>
          <ul className="event-list">
            {highLoadTimes}
          </ul>
        </div>
        <div className="stat">
          <h2>
            CPU Load Recovery
            <Tooltip text={`Under ${HIGH_LOAD_THRESHOLD} for at least ${LOAD_ALERT_THRESHOLD_MINUTES} minutes after high CPU load`}></Tooltip>
          </h2>
          <p>Occurrences: <span className="stat-number">{recoveryTimes?.length}</span></p>
          <ul className="event-list">
            {recoveryTimes}
          </ul>
        </div>
      </div>
    </div>
    );
  };
  
  export default CPULoadStats;
  