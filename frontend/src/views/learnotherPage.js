import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import AuthContext from "../context/AuthContext";
import './learnotherPage.css'; 
import LearnNavComponent from '../components/LearnNav';
import IconSense from '../icon/IconSense'
import Scorebar from "../components/Scorebar";


const LearningPage = () => {
  const { user } = useContext(AuthContext);

//   if (!user){
//     console.log("redirect");
//     return (<Navigate to='/login'  />)
//   }
  
  return (
    <section id="learn_other">
      {/* <h2>{user.name}</h2> 
      <div className="score-container">
        key 값 넘겨줘야함!!!!!!!!!!!!!!!
        {Object.entries(scores).map(([cat, { avg, score }]) => 
          <Scorebar key={cat} cat={cat} avg={avg} score={score} />
        )}
      </div> */}
      <LearnNavComponent />
      <div id="learn_body">
        <div id="learn_up">
            <IconSense />
            <span>시사/상식</span>
            <Scorebar/>
        </div>
        <div id="learn_down"></div>
      </div>
    </section>
  )
}

export default LearningPage;
