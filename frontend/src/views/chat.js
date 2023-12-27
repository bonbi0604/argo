import React, { useState } from 'react';
import './chat.css';
import ChatHistory from '../components/ChatHistory';
import ChatPageChatbot from '../components/ChatPageChatbot';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(''); // Add this state to handle the selected chat content

  const handleSessionSelect = (chatContent) => {
    setSelectedChat(chatContent); // Update this function to handle the selected chat content
  };

  return (
    <div className="chat-container">
      <ChatHistory onSessionSelect={handleSessionSelect} />
      <ChatPageChatbot chatContent={selectedChat} />
    </div>
  );
};

export default Chat;