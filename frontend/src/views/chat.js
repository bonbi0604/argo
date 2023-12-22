import React, { useState } from 'react';
import './chat.css';
import ChatHistory from '../components/ChatHistory';

const Chat = () => {
    const [history, setHistory] = useState([
      "First message",
      "Second message",
    ]);
  
    return (
      <div className="chat-page">
        {/* Render the ChatHistory component and pass the history state to it */}
        <ChatHistory history={history} />

        {/* The rest of your chat page content goes here */}
        {/* This may include your chat message display area, input field, etc. */}
      </div>
    );
  };


export default Chat;