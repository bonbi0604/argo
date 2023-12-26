import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

let sessionCounter = parseInt(localStorage.getItem('sessionCounter')) || 1;

function generateSessionId() {
  const sessionId = sessionCounter.toString();
  sessionCounter++; // 다음 세션을 위해 카운터 증가

  // 다음 세션 카운터를 로컬 스토리지에 저장
  localStorage.setItem('sessionCounter', sessionCounter.toString());

  return sessionId;
}

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null); // 세션 ID 추가
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatMessagesRef = useRef(null);

  const saveChatSession = async () => {
    const chatContent = messages.map((m) => m.text).join('\n');
    const response = await fetch('http://127.0.0.1:8000/chatbot/api/chat-sessions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId, // 세션 ID를 백엔드로 보냄
        chat_content: chatContent,
      }),
    });

    if (!response.ok) {
      console.error('Error saving chat session');
    }
  };

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
  }, [messages, sessionId]);

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
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async () => {
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const userMessage = { text: input, sender: 'user' };
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
        body: JSON.stringify({ message: input, session_id: sessionId }), // 세션 ID를 포함하여 백엔드로 전송
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

  // 초기 세션 ID 생성
  useEffect(() => {
    const newSessionId = generateSessionId(); // 세션 ID를 생성하는 함수 구현 필요
    setSessionId(newSessionId);
  }, []);

  return (
    <div>
      <div className={`chatbot-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
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