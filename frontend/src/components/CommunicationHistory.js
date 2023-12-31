import { useEffect, useState, useContext } from "react";
import "./CommunicationHistory.css";
import CommunicationHistoryList from "./CommunicationHistoryList";
import AuthContext from '../context/AuthContext';

const history = {
  "history_no" : 4,
  "title": "전언에 대한 전화 협의 일정 조정",
  'code': 3,
  "history" : [
    {
      "speaker": "user",
      "sentence": "<START>",
      "labels": { "Clear": 0, "Concise": 0, "Concrete": 0, "Correct": 0, "Coherent": 0, "Complete": 0, "Courteous": 0 }
    },
    {
        "speaker": "chatbot",
        "sentence": "네, K사 시스템 개발부입니다.",
        "labels": {}
    },
    {
        "speaker": "user",
        "sentence": "H사의 타카이치라고 합니다. 늘 신세가 많습니다.",
        "labels": { "Clear": 0, "Concise": 1, "Concrete": 1, "Correct": 2, "Coherent": 2, "Complete": 1, "Courteous": 1 }
    },
    {
        "speaker": "chatbot",
        "sentence": "저야말로 신세를 지고 있습니다.",
        "labels": {}
    },
    {
        "speaker": "user",
        "sentence": "이나다씨 계십니까? 한 시간 정도 전에 전화주셨다고 하는데요.",
        "labels": { "Clear": 3, "Concise": 1, "Concrete": 1, "Correct": 2, "Coherent": 3, "Complete": 1, "Courteous": 1 }
    },
    {
        "speaker": "chatbot",
        "sentence": "네, 바꿔드릴게요. 잠깐만 기다려 주십시오. 이나다(田) 씨, H사의 다카이치(高市) 님으로부터 전화가 왔습니다.",
        "labels": {}
    },
    {
        "speaker": "user",
        "sentence": "여보세요, 이나다입니다.",
        "labels": { "Clear": 3, "Concise": 1, "Concrete": 2, "Correct": 2, "Coherent": 0, "Complete": 1, "Courteous": 1 }
    },
    {
        "speaker": "chatbot",
        "sentence": "H사의 다카이치입니다. 신세 많이 졌습니다.",
        "labels": {}
    },
    {
      "speaker": "user",
      "sentence": "신세 많이 졌습니다.",
      "labels": { "Clear": 1, "Concise": 1, "Concrete": 1, "Correct": 2, "Coherent": 3, "Complete": 1, "Courteous": 1 }
    },
    {
      "speaker": "chatbot",
      "sentence": "이번주 회의 관련해서 전화 드렸습니다.",
      "labels": {}
    },
  ]
}

const CommunicationHistory = ({stopped, stateN, setStateN, setStopped, historyId, setHistoryId}) => {
  const { user } = useContext(AuthContext);
  const labelSums = { Clear: 0, Concise: 0, Concrete: 0, Correct: 0, Coherent: 0, Complete: 0, Courteous: 0, };
  const labelCounts = { Clear: 0, Concise: 0, Concrete: 0, Correct: 0, Coherent: 0, Complete: 0, Courteous: 0, };
  const [historyList, setHistoryList] = useState({});
  const BASEURL = "http://127.0.0.1:8000/";

  // data 보내는 함수
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

  const getHistory = async () => {
    const sendingData = {'user_no':user.user_no};
    const recieveData = await submit(sendingData, `${BASEURL}learn/communication/history/`);
    setHistoryList(recieveData);
    console.log("history list", recieveData);
  }

  useEffect(() => {
    getHistory();
  }, []);


  // 데이터 순회하며 레이블 값 누적
  history.history.forEach(entry => {
    const labels = entry.labels;
    Object.keys(labels).forEach(label => {
      if (labels[label] !== 0) {
        labelSums[label] += labels[label];
        labelCounts[label] += 1;
      }
    });
  });

  // 각 레이블의 평균 계산
  const labelAverages = {};
  Object.keys(labelSums).forEach(label => {
    labelAverages[label] = labelCounts[label] > 0 ? labelSums[label] / labelCounts[label] : 0;
  });


  return (
    <div className="history_wrapper">
        <div className="history_contents">
          <div className="history_communicaiton_chatbot_container">
            <div className="history_title">
                <div className="history_title_inner">{`${historyId}: ${history.title}`}</div>
            </div> 
            <div className="history_chat_messages">
              {history.history.slice(1, -1).map((message, index) => (
              <div className="history_chat_messages_inner">
                <div key={index} className={`history_message_${message.speaker} history_message`}>
                  {message.sentence}
                </div>
                <div className="sevenC_wrapper" >
                  <div className="sevenC_wrapper_inner">
                    {Object.entries(message.labels).map(([key, value]) =>
                      <div className={`sevenC${value} sevenC_inner`}>{`${key}`}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>

            <hr />

            <div className="history_score">
              {Object.entries(labelAverages).map(([key, value]) =>
                <div className={`sevenC${value.toFixed()} sevenC_inner`}>{`${key} : ${value.toFixed(2)}`}</div>
              )}
            </div>
          </div>
        </div>
        <div className="history_list">
          <CommunicationHistoryList stopped={stopped} stateN={stateN} setStateN={setStateN} setStopped={setStopped} historyId={historyId} setHistoryId={setHistoryId} />
        </div>
    </div>
  )
}

export default CommunicationHistory;

