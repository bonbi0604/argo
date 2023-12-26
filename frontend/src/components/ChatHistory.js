import React, { useState, useEffect } from 'react';
import './ChatHistory.css';

const ChatHistory = () => {
  const [sessions, setSessions] = useState([]);
  const handleSessionClick = async (sessionId) => {
    try {
      console.log('Clicked Session ID:', sessionId); // 세션 ID 출력
      const response = await fetch(`http://127.0.0.1:8000/chatbot/api/chat-sessions/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session data');
      }
      const data = await response.json();
      
      // Chatbot 컴포넌트로 데이터 전달
      // 여기에서는 콘솔에 데이터만 출력합니다. 실제로는 상태 또는 프롭스로 전달해야 합니다.
      console.log('Session data:', data);
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/chatbot/api/chat-sessions/');
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        console.log('Fetched sessions:', data);
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div>
      {sessions.map((session, index) => (
        <button key={index} onClick={() => handleSessionClick(session.session_id)}>
          Session {session.session_id}
        </button>
      ))}
    </div>
  );
};

export default ChatHistory;