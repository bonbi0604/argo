import React, { useState } from 'react';
import './chat.css';
import ChatHistory from '../components/ChatHistory';
import ChatPageChatbot from '../components/ChatPageChatbot';

const Chat = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedChatContent, setSelectedChatContent] = useState(null);
  const [selectedTitle, setSelectedSessionTitle] = useState(null);

  const handleSessionSelect = (sessionId, chatContent, sessionTitle) => {
    setSelectedSessionId(sessionId);
    setSelectedChatContent(chatContent);
    setSelectedSessionTitle(sessionTitle);
  };

  return (
    <div className="chat-chat-container">
      <ChatHistory onSessionSelect={handleSessionSelect} />
      <ChatPageChatbot id={selectedSessionId} chatContent={selectedChatContent} sessionTitle={selectedTitle}/>
    </div>
  );
};

export default Chat;