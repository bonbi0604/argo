import "./Scorebar.css"

const Scorebar = ({cat, avg, score}) => {
  return (
    <div id={cat} className="score-item">
        <div className="score-box">
            <div className="score-label">
                {cat === "occupation" ? "직무이해" :
                cat === "communication" ? "커뮤니케이션" :
                cat === "commonsense" ? "시사/상식" :
                cat === "tools" ? "도구" :
                cat === "ethic" ? "윤리" : cat}
            </div>
            <hr style={{ border: "1px solid #808080", width: '1', height: '100%'}} />
            <div className="score-bars">
              <div className={`score-bar ${cat}`} style={{ width: `${avg}%` }}></div> 
              <div className={`score-bar user-score ${cat}`} style={{ width: `${score}%` }}></div>            
            </div>
 
        </div>
    </div>
  )
}

export default Scorebar;