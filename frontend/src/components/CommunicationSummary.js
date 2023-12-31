import React, { useContext, useEffect, useState } from 'react';
import "./CommunicationSummary.css"
import RadarChart from "./RadarChart"
import AuthContext from "../context/AuthContext";
import CommunicationHistoryList from './CommunicationHistoryList';



const CommunicationSummary = ({stopped, stateN, setStateN, setStopped, historyId, setHistoryId, currentPage, setCurrentPage}) => {
  const { user } = useContext(AuthContext);

  // todo : get data from "learn/communication/score"
  const dataUser = [23, 43, 62, 15, 84, 34, 46];
  const dataAvg = [64, 43, 34, 24, 56, 32, 64];

  const submit = async (dataSend, url) => { 
    let data;
    try {
      const response = await fetch(url, { // 백엔드 서버에 메시지를 POST 요청
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataSend),
        });

      data = await response.json(); // 백엔드로부터의 응답 받기

    } catch (error) {
      data = null;
      console.error("Error sending message to the chatbot API:", error);
    } finally {
      //
    }
    return data;
  }



  return (
    <div className="radar_chart_wrapper">
      <div className="radar_chart">
        <RadarChart dataUser={dataUser} dataAvg={dataAvg} name={user.name} />
      </div>
      <div className="history_list">
        <CommunicationHistoryList stopped={stopped} stateN={stateN} setStateN={setStateN} setStopped={setStopped} historyId={historyId} setHistoryId={setHistoryId}  currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  )
}

export default CommunicationSummary