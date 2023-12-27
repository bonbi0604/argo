import './LearnNav.css';
import { NavLink } from "react-router-dom";

const LearningPage = () => {
  
  return (
    <>
      <div id="learn_nav">
        <div className="learn_button_group">
          <div className="learn_button">
            <NavLink to="/learn/occupation">1. 직무이해</NavLink>
          </div>
          <div className="learn_button">
            <NavLink to="/learn/communication">2. 커뮤니케이션</NavLink>
          </div>
          <div className="learn_button">
            <NavLink to="/learn/common-sense">3. 시사/상식</NavLink>
          </div>
          <div className="learn_button">
            <NavLink to="/learn/tools">4. 도구</NavLink>
          </div>
          <div className="learn_button">
            <NavLink to="/learn/ethic">5. 윤리</NavLink>
          </div> 
        </div>
      </div>
    </>
  )
}

export default LearningPage;
