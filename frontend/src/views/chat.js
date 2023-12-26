import React, { useState } from 'react';
import './chat.css';
import ChatHistory from '../components/ChatHistory';

const Chat = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const addToChatHistory = (message) => {
    setChatHistory(prevHistory => [...prevHistory, message]);
  };

  return (
    <div>
      <ChatHistory history={chatHistory} />
    </div>
  );
};

export default Chat;