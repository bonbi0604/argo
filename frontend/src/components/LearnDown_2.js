import "./LearnDown_2.css"
import React, { useState, useContext, useCallback } from "react";
import QuestionChoice from "./QuestionChoice";
import QuestionInput from "./QuestionInput";

const LearnDown2 = ({question}) => {

  return (
    <div id="comLearnDown2">
        <p>{question.question_no}</p>
        <div id="learn_content">
            <div id="q">
                <div id="q_content">
                    {question.question_content}
                </div>
                {/* 여기에 보기 추가 */}
                <div id="q_choice">
                    {/* question.is_many_choice */}
                    {question.is_many_choice ? <QuestionChoice question={question}/> : <p></p>}
                </div>
            </div>
            {question.is_many_choice ? <p></p> : <QuestionInput question={question}/>}
        </div>
    </div>
  )
}

export default LearnDown2;