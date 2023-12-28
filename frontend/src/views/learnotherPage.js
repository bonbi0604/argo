import { Navigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import AuthContext from "../context/AuthContext";
import './learnotherPage.css'; 
import LearnNavComponent from '../components/LearnNav';
import LearnDown_1 from "../components/LearnDown_1"
import LearnUpLeft from "../components/LearnUpLeft";
import LearnDown_2 from "../components/LearnDown_2"
import React, { useState, useContext, useCallback } from "react";


// 필요한 것들
// LearnNavComponent : cat, avg, score
// LearnDown_1 : 현재 보여줄 오답 문제(wrongQ) => 가장 최근 오답,
//               원래 정답(answer), 유저 입력(user_input), 정답률(rate), 
//               틀린 문제 리스트(wrongQList)
// 문제풀기 버튼을 누르면
// LearnDown_2 : 풀 문제()

const LearningPage = () => {
  const { user } = useContext(AuthContext);
  const cat = "commonsense";
  const [learnDownContent, setLearnDownContent] = useState(<LearnDown_1/>);
  const [learnUpContent, setLearnUpContent] = useState(<LearnUpLeft/>);
  const [buttonValue, setButtonValue] = useState("문제 풀기")

  if (!user){
    return (<Navigate to='/login'  />)
  }

  const getNextQuestion = () => {
    //다음문제 가져오기
  }

  const handleButtonClick = (cat) => {
    if (buttonValue === "문제 풀기") {
      // 버튼 클릭 시 learn_body 내부의 내용을 변경
      // 백에서 문제 데이터 받아오기
      setLearnDownContent(<LearnDown_2/>);
      setLearnUpContent(<button id="learnBtn" onClick={getNextQuestion}>다음</button>);
      setButtonValue('학습 종료');
    } else {
      // 학습 종료하면 어떤 페이지로?
      setLearnDownContent(<LearnDown_1/>);
      setLearnUpContent(<LearnUpLeft/>)
      setButtonValue('문제 풀기');
    }
  };

  
  return (
    <section>
      <div id="learn_other">
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
      </div>
    </section>
  )
}

export default LearningPage;
