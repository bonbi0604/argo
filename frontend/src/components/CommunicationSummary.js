import React, { useContext } from 'react';
import "./CommunicationSummary.css"
import RadarChart from "./RadarChart"
import AuthContext from "../context/AuthContext";
import CommunicationHistoryList from './CommunicationHistoryList';



const CommunicationSummary = () => {
  const { user } = useContext(AuthContext);

  // todo : get data from "learn/communication/score"
  const dataUser = [23, 43, 62, 15, 84, 34, 46];
  const dataAvg = [64, 43, 34, 24, 56, 32, 64];

  return (
    <div className="radar_chart_wrapper">
      <div className="radar_chart">
        <RadarChart dataUser={dataUser} dataAvg={dataAvg} name={user.name} />
      </div>
      <div className="history_list">
        <CommunicationHistoryList />
      </div>
    </div>
  )
}

export default CommunicationSummary