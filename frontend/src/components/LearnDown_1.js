import "./LearnDown_1.css"
import WrongAnswers from "./wrongAnswers"
import QuestionList from "./QuestionList"
import React, { useState, useContext, useCallback } from "react";

// WrongAnswers : 현재 보여줄 오답 문제(wrongQ) => 가장 최근 오답,
//                원래 정답(answer), 유저 입력(user_answer), 정답률(rate)=>이게 avg인가?
// QuestionList : 틀린 문제 리스트(wrongQList), 페이징에 필요한 내용

const LearnDown1 = ({wrongList}) => {
  const categoryValue = "commonsense";

  return (
    <div id="comLearnDown">
        <WrongAnswers cat={categoryValue}/>
        <QuestionList wrongList={wrongList} totalItems='20' itemsPerPage='4' currentPage='1' setCurrentPage='1'/>
    </div>
  )
}

export default LearnDown1;