import "./QuestionChoice.css"
import React, { useState, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";

const QuestionChoice = ({question}) => {
    const { user } = useContext(AuthContext);
    const user_no = user.user_no;
    const [answer_no, setAnswerNo] = useState("");
    const question_no = question.question_no;

    const chooseAnswer = async (e) => {
        try {
            setAnswerNo(e.target.value)

            // const response1 = await fetch(`http://127.0.0.1:8000/learn/wronglist/`, {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({
            //     user_no,
            //     answer_no,
            //     question_no
            //   })
            // });
            // const data1 = await response1.json();
    
            // if (response1.ok) {
            // //   setWrongList(data1.wrong_question_list)
            // } else {
            // } 
          } catch (error) {
          }
    }

    return (
    <div id="qchoices">
        <ol>
            {Array.isArray(question.choices) && question.choices.map((item) => (
            <li className="qchoice">
                <button value={item.answer_no} onClick={chooseAnswer}>
                    {item.answer_content}
                </button>
            </li>
            ))}
        </ol>
    </div>
    )
}

export default QuestionChoice;