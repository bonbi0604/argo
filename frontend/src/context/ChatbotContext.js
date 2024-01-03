import React, { createContext, useState } from 'react';

export const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [isChatbotExpanded, setIsChatbotExpanded] = useState(false);

  return (
    <ChatbotContext.Provider value={{ isChatbotExpanded, setIsChatbotExpanded }}>
      {children}
    </ChatbotContext.Provider>
  );
};