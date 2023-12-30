import React, { useState, useContext } from 'react';
import AuthContext from "../context/AuthContext"; // 커스텀 인증 컨텍스트를 가져옵니다.
// import CommunicationChatbot from "../components/CommunicationChatbot"
import LearnNav from "../components/LearnNav";
import "./CommunicationPage.css"
import CommunicationHistory from '../components/CommunicationHistory';
import CommunicationStudy from '../components/CommunicationStudy';
import CommunicationSummary from '../components/CommunicationSummary';
import Scorebar from "../components/Scorebar";
import IconStructure from '../icon/IconStructure';


const avg = 60;
const score = 90;

const CommunicationPage = () => {
  const { user } = useContext(AuthContext); // AuthContext에서 user 정보를 가져옵니다.
  
  
  const [stateN, setStateN] = useState(0); // 0: summary, 1: history, 2: study
  const [stopped, setStopped] = useState(false); //  state == 2 일때 학습중/중단
  const [historyId, setHistoryId] = useState(null);


  console.log(stateN, stopped);

  const handleButtonClick = () => {
    
    if (stateN === 0) {
      setStateN(2);
    }
    else if (stateN === 1) {
      setStateN(0);
    }
    else if (stateN === 2 && stopped === false) {
      setStopped(true);
    }
    else {
      setStateN(0);
      setStopped(false);
    }
  };

  return (
    <section className="communication_page">
      <LearnNav />
      <div className="communication_page_inner"><div className="communication_page_inner2">
        
        <div className='communication_page_top'>
          {stateN !== 2? <div className='communication_page_icon'><div className="inner"><IconStructure cat={"communication"} size={`${100}%`} /></div></div>: <></>}
          {stateN !== 2? <div className='communication_page_scorebar'><Scorebar cat={"communication"} avg={avg} score={score}/></div>: <></>}
          <button className="communication_page_button" onClick={handleButtonClick}>{stateN===0? "문제풀기": (stateN===1? "돌아가기": (stopped===false? "중단하기":"돌아가기"))}</button>
        </div>

        <div className='communication_page_contents'>
          {stateN===0? <CommunicationSummary stopped={stopped} stateN={stateN} setStateN={setStateN} setStopped={setStopped} historyId={historyId} setHistoryId={setHistoryId} />: 
          (stateN===1?  <CommunicationHistory stopped={stopped} stateN={stateN} setStateN={setStateN} setStopped={setStopped} historyId={historyId} setHistoryId={setHistoryId} />:
          <CommunicationStudy stopped={stopped} stateN={stateN} setStateN={setStateN} setStopped={setStopped} />)}
        </div>
      
      </div></div>


      </section>
  )
}

export default CommunicationPage;
