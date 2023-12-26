import React, { useState, useEffect, useRef} from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [input, setInput] = useState(''); // 사용자 입력을 저장
    const [messages, setMessages] = useState([]); // 메시지 목록을 저장
    // const [sessionId, setSessionId] = useState(null); // 채팅 세션 ID를 저장
    const [isExpanded, setIsExpanded] = useState(false); //채팅창 열고 닫는 상태 저장
    const [isSubmitting, setIsSubmitting] = useState(false); // 메시지 전송 중인지 추적
    const chatMessagesRef = useRef(null); // chat-messages 요소를 참조

    useEffect(() => {
      // messages 배열이 업데이트될 때마다 스크롤을 아래로 이동
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }, [messages]);
    
    // 채팅창 내에 마우스 커서가 있을 때만 스크롤 이벤트를 처리
  const handleMouseEnter = () => {
    chatMessagesRef.current.addEventListener('wheel', handleScroll);
  };

  // 마우스 커서가 채팅창 밖으로 나갈 때 스크롤 이벤트 리스너를 제거
  const handleMouseLeave = () => {
    chatMessagesRef.current.removeEventListener('wheel', handleScroll);
  };

  const handleScroll = (event) => {
    // 스크롤 이벤트를 처리하여 chat-messages 요소의 scrollTop 값을 조절
    event.preventDefault();
    chatMessagesRef.current.scrollTop += event.deltaY;
  };

    const handleInputChange = (event) => { // 입력 필드가 변경될 때마다 실행되는 함수
      setInput(event.target.value);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
          if (isSubmitting) {
              // 전송 중일 때는 일반 엔터키 이벤트 무시
              event.preventDefault();
              return;
          }
  
          // Shift가 눌리지 않은 상태에서 엔터키를 누를 경우
          event.preventDefault();
          handleSubmit(); // 메시지 전송
      }
  };
    
    const toggleChatbot = () => { // 채팅창 열고 닫는 함수
      setIsExpanded(!isExpanded);
    };

    const handleSubmit = async () => {  // 'Send' 버튼을 클릭하거나 엔터 키를 누를 때 실행하는 함수
        if (!input.trim() || isSubmitting) return; // 입력이 비어있는 경우 메시지를 안보냄

        setIsSubmitting(true);
        console.log(`Sending message: ${input}`); // 콘솔에 보내는 메시지를 로깅
        const userMessage = { text: input, sender: 'user' }; // 사용자 메시지를 생성하여 messages 배열에 추가
        
        setMessages((currentMessages) => { // 메시지 목록 state를 업데이트
          console.log('Current messages:', currentMessages);
          return [...currentMessages, userMessage];
        });

        setInput(''); // 입력 필드 비우기
      
        try {
            const response = await fetch('http://127.0.0.1:8000/chatbot/', { // 백엔드 서버에 메시지를 POST 요청
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
              });

            const data = await response.json(); // 백엔드로부터의 응답 받기
            console.log(`Received data:`, data);

            setMessages((currentMessages) => { // 받은 데이터로 메시지 목록을 업데이트
              const updatedMessages = [...currentMessages, { text: data.reply, sender: 'bot' }];
              console.log('Updated messages:', updatedMessages);
              return updatedMessages;
            });
        } catch (error) {
            console.error("Error sending message to the chatbot API:", error); // 에러가 발생하면 콘솔에 에러를 로깅
        } finally {
          setIsSubmitting(false); // 메시지 전송 완료
        }
    };
    

    return (
      <div>
        <div className={`chatbot-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <button onClick={toggleChatbot} className="toggle-chatbot">{isExpanded ? '◀' : "▶"}</button>
          <div className="chatbot-container">
            <div className="chat-messages" ref={chatMessagesRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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