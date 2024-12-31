
import React from 'react';
import { useAPI } from '../apiContext';
import "./LoadStats.css";
import { HIGH_LOAD_THRESHOLD, LOAD_ALERT_THRESHOLD_MINUTES } from '../config';
import Tooltip from './Tooltip';

const LoadStats = () => {
    const data  = useAPI();

    const exceedTimes = data.highLoadTimes?.map(item => <li key={item.time.getTime()}>{item.time.toLocaleDateString() + " " + item.time.toLocaleTimeString()}</li>);
    const recoveryTimes = data.recoveryTimes?.map(item => <li key={item.time.getTime()}>{item.time.toLocaleDateString() + " " +  item.time.toLocaleTimeString()}</li>);

   return (
    <div className="container">
      <div className="stats">
        <div className="stat">
          <h2>Current CPU Load</h2>
          <span className='stat-number'>{data.currentLoad?.toFixed(2)}</span>
        
        </div>
        <div className="stat">
          <h2>
            Heavy CPU Load History
            <Tooltip text={`At or above ${HIGH_LOAD_THRESHOLD} for at least ${LOAD_ALERT_THRESHOLD_MINUTES} minutes`}></Tooltip>
          </h2>
          <p>Occurrences: <span className="stat-number">{exceedTimes?.length}</span></p>
          <ul id="heavy-list" className="event-list">
            {exceedTimes}
          </ul>
        </div>
        <div className="stat">
          <h2>
            CPU Load Recovery History 
            <Tooltip text={`Under ${HIGH_LOAD_THRESHOLD} for at least ${LOAD_ALERT_THRESHOLD_MINUTES} minutes after high CPU load`}></Tooltip>
          </h2>
          

          <p>Occurrences: <span className="stat-number">{recoveryTimes?.length}</span></p>
          <ul id="recovery-list" className="event-list">
            {recoveryTimes}
          </ul>
        </div>
      </div>
    </div>
    );
  };
  
  export default LoadStats;
  