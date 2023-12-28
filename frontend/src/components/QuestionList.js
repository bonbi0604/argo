import "./QuestionList.css"
import Pagination from "./Pagination"

const QuestionList = () => {
  const changeWrongQuestion = () => {
    console.log("HELLO")
    // 여기에 정의해도 실행이 되나?
  }

  const searchWrongQuestion = () => {

  }

  return (
    <div id="q_list">
      <div id="searchCenter">
        <div id="searchInputDiv">
          <input id="searchInput" />
          <div id="searchBtnDiv">
            <button type="button" onClick={searchWrongQuestion}>
              <img id="searchWrongImg" src="https://cdn-icons-png.flaticon.com/128/49/49116.png"/>
            </button>
          </div>
        </div>
      </div>
      <div id="q_container">
        {/* 클릭하면 오답노트쪽이 해당 문제로 바뀜 */}
        <div className="q_content" onClick={changeWrongQuestion}>
          <div>125. 시사문제 제목</div>
        </div>
        <div className="q_content"></div>
        <div className="q_content"></div>
        <div className="q_content"></div>
      </div>
      <div>
        <Pagination/>
      </div>
    </div>
  )
}

export default QuestionList;