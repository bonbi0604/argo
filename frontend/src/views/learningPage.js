// LearningPage.js

import { useContext } from "react";
import UserInfo from "../components/UserInfo";
import AuthContext from "../context/AuthContext";
import './learningPage.css'; // 스타일시트를 추가합니다.

const scores = {
  occupation: { avg: 75, score: 80 }, // 직무이해 점수
  communication: { avg: 60, score: 90 }, // 커뮤니케이션 점수
  commonsense: { avg: 79, score: 40 }, // 시사/상식 점수
  tools: { avg: 90, score: 80 }, // 도구 점수
  ethic: { avg: 50, score: 70 }, // 윤리 점수
};

const LearningPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="learning-page">
      <h2>{user.name}</h2> 
      
      <div className="score-container">
        {Object.entries(scores).map(([key, { avg, score }]) => (
          <div key={key} className="score-item">
            <div className="score-box">
              <div className="score-label">
                {key === "occupation" ? "직무이해" :
                 key === "communication" ? "커뮤니케이션" :
                 key === "commonsense" ? "시사/상식" :
                 key === "tools" ? "도구" :
                 key === "ethic" ? "윤리" : key}
              </div> 
              <div className={`score-bar ${key}`} style={{ width: `${avg}%` }}></div> 
              <div className={`score-bar user-score ${key}`} style={{ width: `${score}%` }}></div> 
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningPage;
