import "./LearnDown_1.css"
import WrongAnswers from "./wrongAnswers"
import QuestionList from "./QuestionList"
import React, { useState, useContext, useCallback } from "react";

const QustList = () => {
  const categoryValue = "commonsense";
  const avg = 50;
  const score = 40;

  return (
    <div id="comLearnDown">
        <WrongAnswers cat={categoryValue}/>
        <QuestionList totalItems='20' itemsPerPage='4' currentPage='1' setCurrentPage='1'/>
    </div>
  )
}

export default QustList;