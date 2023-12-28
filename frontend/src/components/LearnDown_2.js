import "./LearnDown_2.css"
import React, { useState, useContext, useCallback } from "react";

const QustList = () => {
  const categoryValue = "commonsense";
  const avg = 50;
  const score = 40;

  return (
    <div id="comLearnDown2">
        <p>문제 135</p>
        <div id="learn_content">
            <div id="q">
                <div>
                    최근 러시아와 전쟁하는 나라는?
                </div>
            </div>
            <div id="a">
                <div id="learnInputDiv">
                    <input placeholder="이곳에 입력하세요"/>
                </div>
                <div id="learnbtnDiv">
                    <button>입력</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default QustList;