import LearnOtherPage from "../learnotherPage";
import React, { useState, useContext, useCallback } from "react";

const LearnOccupation = () => {
  const cat = "occupation";

  return (
    <LearnOtherPage cat={cat}/>
  )
}

export default LearnOccupation;