import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import AuthContext from "../context/AuthContext";
import './LearnNav.css';
import Scorebar from "../components/Scorebar";

const LearningPage = () => {
  
  return (
    <div id="learn_nav">
        <ol type="1">
            <li>1. 직무이해</li>
            <li>2. 커뮤니케이션</li>
            <li>3. 시사/상식</li>
            <li>4. 도구</li>  
            <li>5. 윤리</li>          
        </ol>
    </div>
  )
}

export default LearningPage;
