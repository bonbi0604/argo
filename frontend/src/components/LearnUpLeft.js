import "./LearnUpLeft.css"
import IconSense from '../icon/IconSense'
import Scorebar from "../components/Scorebar";
import React, { useState, useContext, useCallback } from "react";

const LearnUpLeft = ({cat, avg, score}) => {

  return (
    <div id="comLearnUpLeft">
        {/* if문으로 아이콘 다르게 불러오기 */}
        <IconSense />
        <Scorebar cat={cat} avg={avg} score={score}/>
    </div>
  )
}

export default LearnUpLeft;