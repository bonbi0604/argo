// import React, { useState, useEffect, useRef } from 'react';
// import './ChatPageChatbot.css';

// const ChatPageChatbot = ({ chatContent }) => {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [sessionTitle, setSessionTitle] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const chatMessagesRef = useRef(null);

//   const saveChatSession = async () => {
//     if (!sessionTitle) return; // 세션 제목이 없으면 저장하지 않음

//     const chatContent = messages.map((m) => m.text).join('\n');
//     const method = sessionTitle ? 'PUT' : 'POST';
//     const url = sessionTitle 
//       ? `http://127.0.0.1:8000/chatbot/api/chat-sessions/${sessionTitle}/`
//       : 'http://127.0.0.1:8000/chatbot/api/chat-sessions/';

//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         session_title: sessionTitle,
//         chat_content: chatContent,
//       }),
//     });

//     if (!response.ok) {
//       console.error('Error saving chat session');
//     }
//   };

//   useEffect(() => {
//     chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
//     const handleBeforeUnload = (e) => {
//       e.preventDefault();
//       saveChatSession();
//     };
  
//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [messages, sessionId]);


//   useEffect(() => {
//     // 채팅 내용을 설정하는 useEffect
//     if (chatContent) {
//       const newMessages = chatContent.split('\n').map(text => ({
//         text,
//         sender: 'user' // 'user' 또는 'bot'에 따라 조정하세요.
//       }));
//       setMessages(newMessages);
//     }
//   }, [chatContent]);

//   useEffect(() => {
//     // 초기 세션 ID 설정 또는 기존 세션 ID 사용
//     if (initialSessionId) {
//       setSessionId(initialSessionId);
//     } else {
//       setSessionId(generateSessionId());
//     }
//   }, [initialSessionId]);

//   const handleMouseEnter = () => {
//     chatMessagesRef.current.addEventListener('wheel', handleScroll);
//   };

//   const handleMouseLeave = () => {
//     chatMessagesRef.current.removeEventListener('wheel', handleScroll);
//   };

//   const handleScroll = (event) => {
//     event.preventDefault();
//     chatMessagesRef.current.scrollTop += event.deltaY;
//   };

//   const handleInputChange = (event) => {
//     setInput(event.target.value);
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter' && !event.shiftKey) {
//       if (isSubmitting) {
//         event.preventDefault();
//         return;
//       }

//       event.preventDefault();
//       handleSubmit();
//     }
//   };

//   const handleSubmit = async () => {
//     if (!input.trim() || isSubmitting) return;

//     setIsSubmitting(true);

//     const userMessage = { text: input, sender: 'user' };
//     if (!sessionTitle && messages.length === 0) {
//       // 첫 번째 사용자 메시지를 세션 제목으로 설정
//       setSessionTitle(input);
//     }
//     setMessages((currentMessages) => [...currentMessages, userMessage]);

//     setInput('');

//     try {
//       const response = await fetch('http://127.0.0.1:8000/chatbot/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: input, session_id: sessionId }),
//       });

//       const data = await response.json();
//       setMessages((currentMessages) => [...currentMessages, { text: data.reply, sender: 'bot' }]);
//     } catch (error) {
//       console.error('Error sending message to the chatbot API:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // 초기 세션 ID 생성
//   useEffect(() => {
//     const newSessionId = generateSessionId();
//     setSessionId(newSessionId);
//   }, []);

//   return (
//       <div className="chatbot-container">
//         <div className="chat-messages" ref={chatMessagesRef}>
//           {messages.map((message, index) => (
//             <div key={index} className={`message ${message.sender}`}>
//               {message.text}
//             </div>
//           ))}
//         </div>
//         <div className="chat-input-container">
//           <textarea
//             className="chat-input"
//             value={input}
//             onChange={handleInputChange}
//             placeholder="질문을 입력하세요"
//             onKeyDown={handleKeyDown}
//           />
//           <button className="chat-submit" onClick={handleSubmit}>
//             Send
//           </button>
//         </div>
//       </div>
//   );
// };

// export default ChatPageChatbot;