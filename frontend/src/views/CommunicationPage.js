// import React, { useState, useContext } from 'react';
// import UserInfo from "../components/UserInfo"; // UserInfo 컴포넌트를 가져옵니다.
// import AuthContext from "../context/AuthContext"; // 커스텀 인증 컨텍스트를 가져옵니다.
// import "./homePage.css"
// import Chatbot from "../components/chatbot"

// const CommunicationPage = () => {
//   const { user } = useContext(AuthContext); // AuthContext에서 user 정보를 가져옵니다.
  
//   const [showChatbot, setShowChatbot] = useState(false);

//   const handleButtonClick = () => {
//     console.log("clicked", showChatbot);
//     setShowChatbot(!showChatbot);
//   };

//   return (
//     <>
//     <div className="main-section">
//       <button onClick={handleButtonClick}>{showChatbot? "study":"stop"}</button>
//       <section>
//       < h1>You are on CommunicationPage</h1>
//         {/* user가 존재하는 경우 UserInfo 컴포넌트를 렌더링합니다. */}
//         {user && <UserInfo user={user} />}
//         {showChatbot && <Chatbot />}
        
//       </section>
//     </div>
//     </>
//   )
// }

// export default CommunicationPage;


import React, { useState, useContext } from 'react';
import AuthContext from "../context/AuthContext";
import UserInfo from "../components/UserInfo";
import Chatbot from "../components/CommunicationChatbot";

const CommunicationPage = () => {
  const { user } = useContext(AuthContext);

  const [showChatbot, setShowChatbot] = useState(false);
  const [buttonStr, setbuttonStr] = useState("study");

  const handleButtonClick = () => {
    setShowChatbot(!showChatbot);
    setbuttonStr(showChatbot? "study":"stop");
  };

  return (
    <div>
      {user && <UserInfo user={user} />}
      <h1>Your on communication page.</h1>
      <button onClick={handleButtonClick}>{buttonStr}</button>

      <section>
        {showChatbot && <Chatbot />}
        {/* 다른 섹션 내용들 */}
      </section>
    </div>
  );
};

export default CommunicationPage;