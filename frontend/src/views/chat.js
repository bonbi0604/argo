import React, { useState } from 'react';
import './chat.css';
import ChatHistory from '../components/ChatHistory';
import ChatPageChatbot from '../components/ChatPageChatbot';

const Chat = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const addToChatHistory = (message) => {
    setChatHistory(prevHistory => [...prevHistory, message]);
  };

  return (
    <div className="chat-container">
      <ChatHistory history={chatHistory} />
      <ChatPageChatbot />
    </div>
  );
};

export default Chat;