import LearnOtherPage from "../learnotherPage";
import React, { useState, useContext, useCallback } from "react";

const LearnTools = () => {
  const cat = "tools";

  return (
    <LearnOtherPage cat={cat}/>
  )
}

export default LearnTools;