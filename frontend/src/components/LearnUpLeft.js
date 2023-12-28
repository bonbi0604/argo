import "./LearnUpLeft.css"
import IconSense from '../components/IconSense'
import Scorebar from "../components/Scorebar";
import React, { useState, useContext, useCallback } from "react";

const LearnUpLeft = () => {
  const cat = "commonsense";
  const avg = 80
  const score = 70

  return (
    <div id="comLearnUpLeft">
        <IconSense />
        <Scorebar cat={cat} avg={avg} score={score}/>
    </div>
  )
}

export default LearnUpLeft;