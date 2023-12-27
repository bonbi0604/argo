import "./QuestionList.css"

const QuestionList = () => {
  return (
    <div id="q_list">
        <input id="searchInput" />
        <div id="q_container">
            <div className="q_content"></div>
            <div className="q_content"></div>
            <div className="q_content"></div>
            <div className="q_content"></div>
        </div>
        <div>
                1  2  3  4  5  
        </div>
    </div>
  )
}

export default QuestionList;