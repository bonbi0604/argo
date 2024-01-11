import { React, useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import "./resultPage.css";
import DonutCharts from "../components/DonutCharts";
import AuthContext from "../context/AuthContext";
import LineChart from "../components/LineChart";
import HorizontalBarChart from "../components/HorizontalBarChart";

const data = {
    occupation: {
        time: [
            1703615257000, 1703716257000, 1703817257000, 1703918257000,
            1704019257000, 1704120257000,
        ],
        avg: [45, 23, 56, 76, 78, 80],
        score: [34, 54, 33, 23, 67, 78],
        description: "occupation...",
        cat : ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
        percentage: [23, 45, 56, 43, 65, 76, 56, 75, 86, 100, 24, 57, 57, 86, 75],
    },
    communication: {
        time: [
            1704115257000, 1704116257000, 1704117257000, 1704118257000,
            1704119257000, 1704120257000,
        ],
        avg: [34, 54, 33, 23, 67, 78],
        score: [35, 56, 76, 87, 98, 100],
        description: "communication...",
        cat : ["Clear", "Concise", "Concrete", "Correct", "Coherent", "Complete", "Courteous"],
        percentage: [15, 20, 50, 23, 0, 20, 45],
    },
    commonsense: {
        time: [
            1704115257000, 1704116257000, 1704117257000, 1704118257000,
            1704119257000, 1704120257000,
        ],
        avg: [35, 56, 76, 87, 98, 100],
        score: [34, 45, 56, 67, 78, 89],
        description: "한국어에 대한 능력에서는 평균 이상의 수준을 보이고 있으며, 언어적으로 풍부한 표현을 사용하고 있습니다. 그러나 영어 부분에서는 몇몇 어려움이 나타나고 있습니다. 문법적인 부분에서는 조금 더 주의가 필요하며, 특히 동사 시제와 명사-동사 일치에 주의를 기울이면 도움이 될 것입니다. 또한, 어휘력은 양호하지만 다양한 어휘를 활용하여 더 풍부한 표현을 할 수 있도록 노력하는 것이 중요합니다. 발음에 대해서는 명확하게 표현하면서도 더 자연스러운 억양과 발음 연습을 통해 개선할 수 있을 것입니다. 영어 능력을 향상시키기 위해 뉴스 기사나 영어 소설 등 다양한 자료를 활용하여 독해와 어휘 확장에 노력하는 것이 도움이 될 것입니다. 또한, 영어로 대화를 나누는 연습을 통해 실전에서의 언어 활용 능력을 향상시킬 수 있습니다. 언어적인 도전에 적극적으로 대처하면서 발전해 나가는 데에 흥미와 의지를 가지면 좋을 것입니다.",
        cat : ["영어", "한국어", "시사"],
        percentage: [56, 90, 72],
    },
    tools: {
        time: [
            1704115257000, 1704116257000, 1704117257000, 1704118257000,
            1704119257000, 1704120257000,
        ],
        avg: [34, 45, 56, 67, 78, 89],
        score: [65, 57, 86, 75, 68, 86],
        description: "tools...",
        cat : [],
        percentage: [],
    },
    ethic: {
        time: [
            1704115257000, 1704116257000, 1704117257000, 1704118257000,
            1704119257000, 1704120257000,
        ],
        avg: [65, 57, 86, 75, 68, 86],
        score: [45, 23, 56, 76, 78, 80],
        description: "ethic...",
        cat : [],
        percentage: [],
    },
};

const ResultPage = () => {
    const [scoreData, setScoreData] = useState({});
    const [descriptionData, setDescriptionData] = useState("");
    const { user } = useContext(AuthContext);
    const [cat, setCat] = useState(0);
    const catN2S = [
        "occupation",
        "communication",
        "commonsense",
        "tools",
        "ethic",
    ];
    const color = ["#FFD2D3", "#FFF7DB", "#F4FFE1", "#DEEFFF", "#F4DDFF"];

    const getDictData = (nestedJsonData, dynamicPath) => {
        let value = nestedJsonData;
        for (const path of dynamicPath) {
            value = value[path];
        }
        return value;
    };

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/learn/score/`,
                    {
                        // 백엔드 서버에 메시지를 POST 요청
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user_no: user.user_no }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setScoreData(data.result ? data.result : {});
                    // console.log(data.result);
                } else {
                    console.error("Failed to fetch score data");
                }
            } catch (error) {
                console.error("Error fetching score data", error);
            }
        };

        if (user) {
            fetchScore();
        }
    }, [user]);

    useEffect(() => {
        setDescriptionData(getDictData(data, [catN2S[cat], "description"]));
        // console.log(cat);
    }, [cat]);

    if (!user) {
        // console.log("redirect");
        return <Navigate to="/login" />;
        // return;
    }

    return (
        <section className="result_page">
            <div className="result_page_chart">
                <div className="result_page_donut_chart">
                    <div className="pentagon"></div>
                    <DonutCharts
                        data={scoreData}
                        backgroundColor={"rgba(117, 138, 249, 0)"}
                        setCat={setCat}
                    />
                </div>
                <div className="result_page_line_chart">
                    <LineChart data={data} cat={cat} />
                </div>
            </div>
            <div className="result_page_desc">
                <div
                    className="result_page_desc_inner"
                    style={{ borderColor: `${color[cat]}` }}
                >
                    <p className="title_occ">{`${user.name} 님의 ${catN2S[cat]} 설명입니다.`}</p>
                    <HorizontalBarChart catData={data[catN2S[cat]]["percentage"]} labels= {data[catN2S[cat]]["cat"] } color={color[cat]}/>
                    {descriptionData}
                </div>
            </div>
        </section>
    );
};

export default ResultPage;
