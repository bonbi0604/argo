import LearnOtherPage from "../learnotherPage";
import React, { useState, useContext, useCallback, useEffect } from "react";
import AuthContext from "../../context/AuthContext";

// 필요한 것들
// WrongQuestion : 1. cat, avg, score => ScoreBar 데이터
//                 2. 현재 보여줄 오답 문제(wrongQ)(가장 최근 오답),
//                    원래 정답(answer), 유저 입력(user_answer), 정답률(rate)(이게 avg인가?) => WrongAnswers 데이터
//                 3. 틀린 문제 리스트(wrongQList) => QuestionList 데이터
// SolveQuestion : 4. 풀 문제(question) => LearnDown_2 데이터
// + 5. 푼 문제 DB에 저장하는 함수

// 한번에 전부 불러오는걸로

const LearnCommonSense = () => {
    const cat = "ethic";
    const { user } = useContext(AuthContext);
    const [wrongList, setWrongList] = useState("");
    const [question, setQuestion] = useState({
        question_no: "",
        question_content: "문제를 불러오는 중입니다.",
        choices: "",
        correct_answer: "",
        is_many_choice: "",
    });
    const [avg, setAvg] = useState(0);
    const [score, setScore] = useState(0);
    const user_no = user.user_no;

    useEffect(() => {
        const getLearnPageData = async () => {
            try {
                //풀 문제
                const response1 = await fetch(
                    `http://argo12.duckdns.org:8000/learn/getQuestion/`,
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
                const data1 = await response1.json();

                if (response1.ok) {
                    setQuestion(data1.wrong_question);
                } else {
                    console.error("풀 문제 오류");
                } //풀 문제 끝

                //avg, score
                const response2 = await fetch(
                    `http://argo12.duckdns.org:8000/learn/getAvgScore/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            cat,
                            user_no,
                        }),
                    }
                );
                const data2 = await response2.json();

                if (response2.ok) {
                    setAvg(data2.score.total_avg);
                    setScore(data2.score.user_avg);
                } else {
                }
            } catch (error) {
                console.error("learn-other 오류", error);
            }
        };

        //함수 호출
        getLearnPageData();
    }, []);

    return (
        <LearnOtherPage cat={cat} avg={avg} score={score} question={question} />
    );
};

export default LearnCommonSense;
