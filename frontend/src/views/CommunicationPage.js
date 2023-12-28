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
  
  
  const [state, setState] = useState(0); // 0: summary, 1: history, 2: study
  const [stopped, setStopped] = useState(false); //  state == 2 일때 학습중/중단


  console.log(state, stopped);

  const handleButtonClick = () => {
    
    if (state !== 2) {
      setState(2);
    }
    else if (stopped === false) {
      setStopped(true);
    }
    else {
      setState(0);
      setStopped(false);
    }
  };

  return (
    <section className="communication_page">
      <LearnNav />
      <div className="communication_page_inner"><div className="communication_page_inner2">
        
        <div className='communication_page_top'>
          <div className='communication_page_icon'><div className="inner"><IconStructure cat={"communication"} size={`${100}%`} /></div></div>
          <div className='communication_page_scorebar'><Scorebar cat={"communication"} avg={avg} score={score}/></div>
          <button className="communication_page_button" onClick={handleButtonClick}>{state!==2? "문제풀기": (stopped===false? "중단하기":"돌아가기")}</button>
        </div>

        <div className='communication_page_contents'>
          {state===0? <CommunicationSummary />: (state===1?  <CommunicationHistory />:<CommunicationStudy />)}
        </div>
      
      </div></div>


      </section>
  )
}

export default CommunicationPage;


// import React, { useState, useContext } from 'react';
// import AuthContext from "../context/AuthContext";
// import UserInfo from "../components/UserInfo";
// import Chatbot from "../components/CommunicationChatbot";

// const CommunicationPage = () => {
//   const { user } = useContext(AuthContext);

//   const [showChatbot, setShowChatbot] = useState(false);
//   const [buttonStr, setbuttonStr] = useState("study");

//   const handleButtonClick = () => {
//     setShowChatbot(!showChatbot);
//     setbuttonStr(showChatbot? "study":"stop");
//   };

//   return (
//     <div>
//       {user && <UserInfo user={user} />}
//       <h1>Your on communication page.</h1>
//       <button onClick={handleButtonClick}>{buttonStr}</button>

//       <section>
//         {showChatbot && <Chatbot />}
//         {/* 다른 섹션 내용들 */}
//       </section>
//     </div>
//   );
// };

// export default CommunicationPage;