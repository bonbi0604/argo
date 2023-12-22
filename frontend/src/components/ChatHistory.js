import React from 'react';
import './ChatHistory.css';

const ChatHistory = ({ history }) => {
  return (
    <div className="chat-history">
      <ul>
        {history.map((item, index) => (
          <li key={index} className="history-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;