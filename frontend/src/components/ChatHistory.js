import React, { useState, useEffect } from 'react';
import './ChatHistory.css';

const ChatHistory = ({ onSessionSelect }) => {
  const [sessions, setSessions] = useState([]);

  const handleSessionClick = async (id) => {
    try {
      console.log('Clicked ID:', id);
      const response = await fetch(`http://127.0.0.1:8000/chatbot/api/chat-sessions/${id}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch session data');
      }
      const data = await response.json();
      console.log('Session data:', data);

      // onSessionSelect 콜백을 호출하여 채팅 세션 데이터 전달
      if (onSessionSelect) {
        onSessionSelect(data.id, data.chat_content); // 세션 ID와 채팅 내용 전달
      }
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
        const validSessions = data.filter(session => session.id != null); // id가 존재하는 세션만 필터링
        console.log('Fetched sessions:', validSessions);
        setSessions(validSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="session-list">
      {sessions.map(session => (
        <button key={session.id} onClick={() => handleSessionClick(session.id)}>
          {session.session_title}
        </button>
      ))}
    </div>
  );
};

export default ChatHistory;