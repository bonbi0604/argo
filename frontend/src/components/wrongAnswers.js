import "./wrongAnswers.css"

const WrongAnswers = () => {
  return (
    <div id="q_div">
        <p>오답노트</p>
        <div id="wrongDiv">
          <p>135. 최근 러시아와 전쟁하는 나라는 어디입니까?</p>
          <div className="line"></div>
          <div id="wrAnswerDiv">
            <div>정답: 우크라이나</div>
            <div>입력: 우즈베키스탄</div>
            <div id="ansPer">정답률: 80%</div>
          </div>
        </div>
    </div>
  )
}

export default WrongAnswers;