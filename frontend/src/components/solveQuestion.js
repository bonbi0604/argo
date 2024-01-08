import "./solveQuestion.css";
import LearnDown_2 from "../components/LearnDown_2";
import React, { useState, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";

// LearnDown_2 : 풀 문제(question)

const SolveQuestion = ({ cat, question }) => {
    const { user } = useContext(AuthContext);
    const user_no = user.user_no;
    const [answer_no, setAnswerNo] = useState(""); //유저가 고른 답
    const [now_question, setNowQuestion] = useState(question); //현재 문제
    const question_no = now_question.question_no; //현재 문제 번호
    const [user_content, setUserContent] = useState("");

    const chooseAnswer = async (choose, user_content) => {
        try {
            // setAnswerNo(choose);

            //Result 저장
            await fetch(`https://be.argo12.duckdns.org/learn/insertResult/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_no,
                    answer_no: choose,
                    question_no,
                    user_content,
                }),
            });

            //문제 불러오기
            const response2 = await fetch(
                `https://be.argo12.duckdns.org/learn/getQuestion/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cat,
                    }),
                }
            );
            const data2 = await response2.json();

            if (response2.ok) {
                setNowQuestion(data2.wrong_question);
            } else {
            }
        } catch (error) {}

        setUserContent("");
    };

    return (
        <div id="solve_question">
            <div id="learn_down">
                <LearnDown_2
                    chooseAnswer={chooseAnswer}
                    question={now_question}
                    user_content={user_content}
                    setUserContent={setUserContent}
                />
            </div>
        </div>
    );
};

export default SolveQuestion;
