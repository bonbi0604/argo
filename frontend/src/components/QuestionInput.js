import "./QuestionInput.css"
import React, { useState, useContext, useCallback } from "react";

const QuestionInput = () => {

  return (
    <div id="a">
        <div id="learnInputDiv">
            <input placeholder="이곳에 입력하세요"/>
        </div>
        <div id="learnbtnDiv">
            <button>입력</button>
        </div>
    </div>
  )
}

export default QuestionInput;