import "./solveQuestion.css"
import LearnDown_2 from "../components/LearnDown_2"
import React, { useState, useContext, useCallback } from "react";

// LearnDown_2 : 풀 문제(question)

const solveQuestion = ({cat, question}) => {
  const getNextQuestion = () => {
    //다음문제 가져오기
  }

  return (
    <div id="solve_question">
        <div id="learn_up">
        <div id="learn_up_left">
            {/* <button id="learnBtn" onClick={getNextQuestion}>다음</button> */}
        </div>
        </div>
        <div id="learn_down">
            <LearnDown_2 cat={cat} question={question}/>
        </div>
    </div>
  )
}

export default solveQuestion;