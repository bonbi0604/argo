import React, { useState, useEffect, useRef, useContext } from 'react';
import './ChatPageChatbot.css';
import AuthContext from "../context/AuthContext";
 
const ChatPageChatbot = ({ chatContent }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionTitle, setSessionTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatMessagesRef = useRef(null);
 
  const { user } = useContext(AuthContext);
 
  const saveChatSession = async () => {
    if (!sessionTitle || messages.length === 0) return;
 
    const chatContent = messages.map((m) => m.text).join('\n');
    await fetch('http://127.0.0.1:8000/chatbot/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,  // 사용자 ID
        session_title: sessionTitle,  // 세션 제목
        chat_content: chatContent,  // 채팅 내용
      }),
    }).then(response => {
      if (!response.ok) {
        console.error('Error saving chat session');
      }
    });
  };
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      saveChatSession();
    };
 
    window.addEventListener('beforeunload', handleBeforeUnload);
 
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages]);
 
 
  useEffect(() => {
    if (chatContent) {
      const newMessages = chatContent.split('\n').map(text => ({
        text,
        sender: 'user'
      }));
      setMessages(newMessages);
    }
  }, [chatContent]);
 
  const handleMouseEnter = () => {
    chatMessagesRef.current.addEventListener('wheel', handleScroll);
  };
 
  const handleMouseLeave = () => {
    chatMessagesRef.current.removeEventListener('wheel', handleScroll);
  };
 
  const handleScroll = (event) => {
    event.preventDefault();
    chatMessagesRef.current.scrollTop += event.deltaY;
  };
 
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
 
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (isSubmitting) {
        event.preventDefault();
        return;
      }
 
      event.preventDefault();
      handleSubmit();
    }
  };
 
  const handleSubmit = async () => {
    if (!input.trim() || isSubmitting) return;
 
    setIsSubmitting(true);
 
    const userMessage = { text: input, sender: 'user' };
    if (!sessionTitle && messages.length === 0) {
      setSessionTitle(input);
    }
    setMessages((currentMessages) => [...currentMessages, userMessage]);
 
    setInput('');
 
    try {
      const response = await fetch('http://127.0.0.1:8000/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
 
      const data = await response.json();
      setMessages((currentMessages) => [...currentMessages, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message to the chatbot API:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="chatbot-container">
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          placeholder="질문을 입력하세요"
          onKeyDown={handleKeyDown}
        />
        <button className="chat-submit" onClick={handleSubmit}>
          Send
        </button>
        <button className="chat-check" onClick={saveChatSession}>
          check
        </button>
      </div>
    </div>
  );
};
 
export default ChatPageChatbot;