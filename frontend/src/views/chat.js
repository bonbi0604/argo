import React, { useState } from 'react';
import './chat.css';
import ChatHistory from '../components/ChatHistory';
import ChatPageChatbot from '../components/ChatPageChatbot';

const Chat = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedChatContent, setSelectedChatContent] = useState(null);

  const handleSessionSelect = (sessionId, chatContent) => {
    setSelectedSessionId(sessionId);
    setSelectedChatContent(chatContent);
  };

  return (
    <div className="chat-container">
      <ChatHistory onSessionSelect={handleSessionSelect} />
      <ChatPageChatbot sessionId={selectedSessionId} chatContent={selectedChatContent} />
    </div>
  );
};

export default Chat;