import React, { useState, useEffect, useRef, useContext  } from 'react';
import './Chatbot.css';
import AuthContext from "../context/AuthContext";
import { ChatbotContext } from '../context/ChatbotContext';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [localSessionTitle, setLocalSessionTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatMessagesRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { isChatbotExpanded, setIsChatbotExpanded } = useContext(ChatbotContext);

  useEffect(() => {
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      saveChatSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages]);

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

  const toggleChatbot = () => {
    setIsChatbotExpanded(!isChatbotExpanded);
  };

  const handleSubmit = async () => {
    if (!input.trim() || isSubmitting) return;
    console.log(user.user_no)
    setIsSubmitting(true);

    const userMessage = { text: input, sender: 'user' };

    if (!localSessionTitle && messages.length === 0) {
      setLocalSessionTitle(input);
    }

    setMessages((currentMessages) => {
      return [...currentMessages, userMessage];
    });

    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:8000/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input}), 
      });

      const data = await response.json();
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages, { text: data.reply, sender: 'bot' }];
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error sending message to the chatbot API:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveChatSession = async () => {
    if (!localSessionTitle || messages.length === 0) return;
    const chatContent = messages.map((m) => m.text).join('\n');

    try {
      const endpoint = 'http://127.0.0.1:8000/chatbot/api/chat-sessions/';
      const method = 'POST';
      
      await fetch(endpoint, { 
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user.user_no,  // 사용자 ID
          session_title: localSessionTitle,  // 세션 제목
          chat_content: chatContent,  // 채팅 내용
        }),
      });

      console.log('Chat session saved successfully');
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  };
  return (
    <div>
      <div className={`chatbot-wrapper ${isChatbotExpanded ? 'expanded' : 'collapsed'}`}>
        <button onClick={toggleChatbot} className="toggle-chatbot">
          {isExpanded ? '◀' : '▶'}
        </button>
        <div className="chatbot-container">
          <div
            className="chat-messages"
            ref={chatMessagesRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;