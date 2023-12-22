import React, { useState } from 'react';
import './chatbot.css';

const Chatbot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleInputChange = (event) => {
      setInput(event.target.value);
    };
  
    const handleSubmit = async () => {
        if (!input.trim()) return; // Prevent sending empty messages
      
        console.log(`Sending message: ${input}`);  // Log the message being sent
        const userMessage = { text: input, sender: 'user' };
        
        setMessages((currentMessages) => {
          console.log('Current messages:', currentMessages); // Log current messages state before update
          return [...currentMessages, userMessage];
        });
        setInput('');
      
        try {
            const response = await fetch('http://127.0.0.1:8000/chatbot/', {  // Use the correct endpoint
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
              });
            const data = await response.json();
            console.log(`Received data:`, data);  // Log the full response data
            
            setMessages((currentMessages) => {
              const updatedMessages = [...currentMessages, { text: data.reply, sender: 'bot' }];
              console.log('Updated messages:', updatedMessages); // Log messages state after update
              return updatedMessages;
            });
        } catch (error) {
            console.error("Error sending message to the chatbot API:", error);
            // Log any errors during fetch
        }
    };
    

    return (
      <div className="chatbot-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            placeholder="질문을 입력하세요"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button className="chat-submit" onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
    );
  };
  
  export default Chatbot;