import { Navigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import AuthContext from "../context/AuthContext";
import './learnotherPage.css'; 
import LearnNavComponent from '../components/LearnNav';
import SolveQuestion from "../components/solveQuestion";
import WrongQuestion from "../components/WrongQuestion";
import React, { useState, useContext, useCallback } from "react";


// 필요한 것들
// WrongQuestion : 1. cat, avg, score => ScoreBar 데이터
//                 2. 현재 보여줄 오답 문제(wrongQ)(가장 최근 오답),
//                    원래 정답(answer), 유저 입력(user_answer), 정답률(rate)(이게 avg인가?) => WrongAnswers 데이터
//                 3. 틀린 문제 리스트(wrongQList) => QuestionList 데이터
// SolveQuestion : 4. 풀 문제(question) => LearnDown_2 데이터
// + 5. 푼 문제 DB에 저장하는 함수

// 한번에 전부 불러오는걸로

const LearnOtherPage = ({cat, avg, score, question}) => {
  const { user } = useContext(AuthContext);
  const [buttonValue, setButtonValue] = useState("문제 풀기");
  const [isstudy, setStudy] = useState(false);

  if (!user){
    return (<Navigate to='/login'  />)
  }

  const handleButtonClick = (cat) => {
    setStudy(!isstudy);
    if (isstudy) {
      setButtonValue("문제 풀기")
    } else {
      setButtonValue("학습 종료")
      // 문제를 여기서 가져오나?
    }
  };

  
  return (
    <section>
      <div id="learn_other">
        <LearnNavComponent/>
        <div id="learn_body">
          <button id="isstudyBtn" onClick={handleButtonClick}>{buttonValue}</button>
          {isstudy? <SolveQuestion cat={cat} question={question}/> : <WrongQuestion cat={cat} avg={avg} score={score}/>}
        </div>
      </div>
    </section>
  )
}

export default LearnOtherPage;
