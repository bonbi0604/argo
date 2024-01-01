import React, { useState,useRef  } from 'react';
import './chat.css';
import ChatHistory from '../components/ChatHistory';
import ChatPageChatbot from '../components/ChatPageChatbot';

const Chat = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedChatContent, setSelectedChatContent] = useState(null);
  const [selectedTitle, setSelectedSessionTitle] = useState(null);
  const chatbotRef = useRef(null);

  const handleSessionSelect = (sessionId, chatContent, sessionTitle) => {
    setSelectedSessionId(sessionId);
    setSelectedChatContent(chatContent);
    setSelectedSessionTitle(sessionTitle);
  };

  const handleCreateNewChat = () => {
    if (chatbotRef.current) {
      chatbotRef.current.saveChatSession();
    }
  };
  return (
    <div className="chat-chat-container">
      <ChatHistory onSessionSelect={handleSessionSelect} onCreateNewChat={handleCreateNewChat}/>
      <ChatPageChatbot ref={chatbotRef} id={selectedSessionId} chatContent={selectedChatContent} sessionTitle={selectedTitle} saveChatSession={handleCreateNewChat}/>
    </div>
  );
};

export default Chat;