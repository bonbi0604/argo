import "./Scorebar.css"

const Scorebar = ({cat, avg, score}) => {
  return (
    <div cat={cat} className="score-item">
        <div className="score-box">
            <div className="score-label">
                {cat === "occupation" ? "직무이해" :
                cat === "communication" ? "커뮤니케이션" :
                cat === "commonsense" ? "시사/상식" :
                cat === "tools" ? "도구" :
                cat === "ethic" ? "윤리" : cat}
            </div> 
            <div className={`score-bar ${cat}`} style={{ width: `${avg}%` }}></div> 
            <div className={`score-bar user-score ${cat}`} style={{ width: `${score}%` }}></div> 
        </div>
    </div>
  )
}

export default Scorebar;