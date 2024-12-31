
import React from "react";
import './App.css';
import { APIContextProvider } from "../apiContext";
import Stats from "./LoadStats";
import LoadChart from "./LoadChart";
import HeavyLoadSimulator from "./HeavyLoadSimulator";

export default function App() {
  return (
    <APIContextProvider>
      <div className="App">
        <div id="top">
          <img src="../assets/dd-favicon.png" alt="DataDog Logo" height="40" />
        </div>
        <div id="main">
          
          <div className="section"> 
            <HeavyLoadSimulator></HeavyLoadSimulator> 
            <Stats />
          </div>
          <div className="section"> 
            <LoadChart />
          </div>
        </div>
      </div>
    </APIContextProvider>
  );
}




