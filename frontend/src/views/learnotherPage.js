import { Navigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import AuthContext from "../context/AuthContext";
import './learnotherPage.css'; 
import LearnNavComponent from '../components/LearnNav';
import LearnDown from "../components/LearnDown_1"
import LearnUpLeft from "../components/LearnUpLeft";
import React, { useState, useContext, useCallback } from "react";


const LearningPage = () => {
  const { user } = useContext(AuthContext);
  const cat = "commonsense";
  const avg = 50;
  const score = 40;
  const [learnDownContent, setLearnDownContent] = useState(<LearnDown/>);
  const [learnUpContent, setLearnUpContent] = useState(<LearnUpLeft/>);
  const [buttonValue, setButtonValue] = useState("문제 풀기")

//   if (!user){
//     console.log("redirect");
//     return (<Navigate to='/login'  />)
//   }

  const handleButtonClick = () => {
    // 버튼 클릭 시 learn_body 내부의 내용을 변경
    setLearnDownContent("HELLO");
    setLearnUpContent(<button id="learnBtn">다음</button>)
    setButtonValue('학습 종료')
  };
  
  return (
    <section id="learn_other">
      <LearnNavComponent cat={cat} />
      <div id="learn_body">
        <div id="learn_up">
          <div id="learn_up_left">
            {learnUpContent}
          </div>
          <button onClick={handleButtonClick}>{buttonValue}</button>
        </div>
        <div id="learn_down">
            {learnDownContent}
        </div>
      </div>
    </section>
  )
}

export default LearningPage;
