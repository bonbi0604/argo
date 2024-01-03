import React, { useState, useEffect, useContext } from 'react';
import './CommunicationChatbot.css';
import './CommunicationHistory.css';
import AuthContext from '../context/AuthContext';

const CommunicationChatbot = ({stopped, stateN, setStateN, setStopped}) => {
    const { user } = useContext(AuthContext);
    const [input, setInput] = useState(''); // 사용자 입력을 저장
    const [messages, setMessages] = useState([]); // 메시지 목록을 저장
    const [subject, setsubject] = useState('정보를 불러오는 중입니다...');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [statecode, setStatecode] = useState(0); // 학습 상태를 나타냄. 0: 학습중, 1: chatbot 정상 종료, 2: chat 비정상 종료, 3: 사용자 종료(중단하기 눌렀을 때)
    const [isSaved, setIsSaved] = useState(false);

    // timestamp -> 시분초 바꿔주는 함수
    const convertTimestampToTime = (timestamp) => {
      const date = new Date(timestamp);
      
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
    
      // 시, 분, 초를 문자열로 반환
      const formattedTime = `${hours} : ${minutes} : ${seconds}`;
    
      return formattedTime;
    }

    const handleInputChange = (event) => { // 입력 필드가 변경될 때마다 실행되는 함수
      setInput(event.target.value);
    };

    // data 를 url 로 보내는 함수
    const submit = async (dataSend, url) => { 
      let data;
      try {
        const response = await fetch(url, { // 백엔드 서버에 메시지를 POST 요청
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataSend),
          });

        data = await response.json(); // 백엔드로부터의 응답 받기

      } catch (error) {
        data = null;
        console.error("Error sending message to the chatbot API:", error);
      } finally {
        //
      }
      return data;
    }
  
    // 'Send' 버튼을 클릭하거나 엔터 키를 누를 때 실행하는 함수
    const handleSubmit = async () => {  
        if (!input.trim()) return; // 입력이 비어있는 경우 메시지를 안보냄
      
        const userMessage = { sentence: input, speaker: 'user', labels: {}, timestamp: new Date().getTime()}; 
        
        setMessages((currentMessages) => { 
          return [...currentMessages, userMessage];
        });

        setInput(''); // 입력 필드 비우기

        setIsButtonDisabled(true); // 버튼 비활성화
        const data = await submit({ message: input, history: messages }, 'http://127.0.0.1:8000/learn/communication/study/');

        setMessages((currentMessages) => { // 받은 데이터로 메시지 목록을 업데이트
          const updatedMessages = [...currentMessages, { sentence: data.reply, speaker: 'chatbot', labels: {}, timestamp: new Date().getTime() }];
          return [...currentMessages, { sentence: data.reply, speaker: 'chatbot', labels: {}, timestamp: new Date().getTime() }];
        });

        // 학습 중일때만 (statecode===0) 버튼 다시 활성화/ statecode 변경
        if(statecode===0) {
          setStatecode(data.code);
          setIsButtonDisabled(false);
        }
    };

    const getLabel = async (message) => {  
      const sendingData = {message: message, history: messages};
      const data = await submit(sendingData, 'http://127.0.0.1:8000/learn/communication/label/');
      return data;
    };


    // 첫 렌더링 시 한번만 실행/ 백엔드에 첫 시작 메시지를 보내는 로직
    useEffect(() => {
        // 컴포넌트가 마운트되면 초기 챗봇 메시지를 보내는 로직 추가

        const handleFirstSubmit = async () => { 
          const userMessage = { sentence: "<START>", speaker: 'user', labels: {}, timestamp: new Date().getTime() }; 
        
          setMessages((currentMessages) => { // 메시지 목록 state를 업데이트
            return [...currentMessages, userMessage];
          });

          setIsButtonDisabled(true); // 버튼 비활성화
          const data = await submit({ message: "<START>", history: messages }, 'http://127.0.0.1:8000/learn/communication/study/');


          setMessages((currentMessages) => { // 받은 데이터로 메시지 목록을 업데이트
            const updatedMessages = [...currentMessages, { sentence: data.reply, speaker: 'chatbot', labels: {}, timestamp: new Date().getTime() }];
            return [...currentMessages, { sentence: data.reply, speaker: 'chatbot', labels: {}, timestamp: new Date().getTime() }];
          }); 
  
          setsubject((currentSubject) => {
            return data.title
          });
        }

        handleFirstSubmit(); // 초기 메시지 보내기
        
    }, []);
    

    // statecode 가 0 이 아닐 때, history 저장 요청. 버튼 비활성화
    useEffect(() => {
      if (statecode != 0) {
        setIsButtonDisabled(true);
        // console.log(statecode, isSaved);
        if (!isSaved && messages.length > 1) {
          setIsSaved(true);
          const sendingData = {
            'user_no':user.user_no,
            'code': statecode,
            'title': subject,
            'timestamp': new Date().getTime(),
            'history': messages
          };
          // console.log(sendingData);
          submit(sendingData, "http://127.0.0.1:8000/learn/communication/save/");
        }
      }
      else {
        setIsButtonDisabled(false);
      }
      // console.log(statecode);
    }, [statecode]);


    // 중단 버튼 눌렀을 때 disabled
    useEffect(() => {
      if (stopped) {
        setStatecode(3);
      }
    }, [stopped]);

    useEffect(() => {
      // 발화자가 user 인 경우 label 얻기
      const fetchData = async () => {
        if (messages.length > 0) {
          const last = messages[messages.length - 1];
          if (last.speaker === "user") {
            const recieveData = await getLabel(last.sentence);
            last.labels = recieveData.labels;
          }
        }
      };

      fetchData();
    }, [messages]);



    return (
      <div className="communicaiton_chatbot_container">
        <div className="communicaiton_chatbot_contents">
          <div className="communicaiton_chatbot_contents_inner">
            <div className="communicaiton_title">
                <div className="communicaiton_title_inner">{subject}</div>
            </div>
            <hr />
            <div className="history_chat_messages">
              {messages.length > 1 && messages.slice(1).map((message, index) => (
                <div className="history_chat_messages_inner">
                  
                    {
                      message.speaker==="chatbot"?
                      <div className="history_chat_messages_inner2">
                        <div key={index} className={`history_message_${message.speaker} history_message`}>
                          {message.sentence}
                        </div>
                        <div className={`message_time message_time_${message.speaker}`}>{convertTimestampToTime(message.timestamp)}</div>
                      </div>
                      :
                      <div className="history_chat_messages_inner2">
                        <div className={`message_time message_time_${message.speaker}`}>{convertTimestampToTime(message.timestamp)}</div>
                        <div key={index} className={`history_message_${message.speaker} history_message`}>
                          {message.sentence}
                        </div>
                        
                      </div>
                    }
                    
                  
                  
                  <div className="sevenC_wrapper" >
                    <div className="sevenC_wrapper_inner">
                      {Object.entries(message.labels).map(([key, value]) =>
                        <div className={`sevenC${value} sevenC_inner`} style={{width: `${value!==0? key.length * 0.6 : 0}em`}}>{value!==0?`${key}`:null}</div>
                      )}
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
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
          <button className="chat-submit" onClick={handleSubmit} disabled={isButtonDisabled}>
            Send
          </button>
        </div>
      </div>
    );
  };
  
  export default CommunicationChatbot;

