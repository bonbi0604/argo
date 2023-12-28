import React, { useContext } from 'react';
import "./CommunicationSummary.css"
import RadarChart from "./RadarChart"
import AuthContext from "../context/AuthContext";



const CommunicationSummary = () => {
  const { user } = useContext(AuthContext);

  const dataUser = [23, 43, 62, 15, 84, 34, 46];
  const dataAvg = [64, 43, 34, 24, 56, 32, 64];
  
  return (
    <div className="radar_chart_wrapper">
      <div className="radar_chart">
        <RadarChart dataUser={dataUser} dataAvg={dataAvg} name={user.name} />
      </div>
        
    </div>
  )
}

export default CommunicationSummary