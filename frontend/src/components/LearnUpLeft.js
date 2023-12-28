import "./LearnUpLeft.css"
import IconSense from '../components/IconSense'
import Scorebar from "../components/Scorebar";
import React, { useState, useContext, useCallback } from "react";

const LearnUpLeft = () => {
  const cat = "commonsense";

  return (
    <div id="comLearnDown">
        <IconSense cat={cat} />
        <Scorebar cat={cat}/>
    </div>
  )
}

export default LearnUpLeft;