import { React, useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import "./resultPage.css";
import DonutCharts from "../components/DonutCharts";
import AuthContext from "../context/AuthContext";
import LineChart from "../components/LineChart";

const data = {
    occupation: {
        time: [
            1703615257000, 1703716257000, 1703817257000, 1703918257000,
            1704019257000, 1704120257000,
        ],
        avg: [45, 23, 56, 76, 78, 80],
        score: [34, 54, 33, 23, 67, 78],
        description: "occupation...",
    },
    communication: {
        time: [
            1704115257000, 1704116257000, 1704117257000, 1704118257000,
            1704119257000, 1704120257000,
        ],
        avg: [34, 54, 33, 23, 67, 78],
        score: [35, 56, 76, 87, 98, 100],
        description: "communication...",
    },
    commonsense: {
        time: [
            1704115257000, 1704116257000, 1704117257000, 1704118257000,
            1704119257000, 1704120257000,
        ],
        avg: [35, 56, 76, 87, 98, 100],
        score: [34, 45, 56, 67, 78, 89],
        description: "commonsense...",
    },
    tools: {
        time: [
            1704115257000, 1704116257000, 1704117257000, 1704118257000,
            1704119257000, 1704120257000,
        ],
        avg: [34, 45, 56, 67, 78, 89],
        score: [65, 57, 86, 75, 68, 86],
        description: "tools...",
    },
    ethic: {
        time: [
            1704115257000, 1704116257000, 1704117257000, 1704118257000,
            1704119257000, 1704120257000,
        ],
        avg: [65, 57, 86, 75, 68, 86],
        score: [45, 23, 56, 76, 78, 80],
        description: "ethic...",
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
                    `http://argo12.duckdns.org:8000/learn/score/`,
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
                    setScoreData(data.result);
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
                    <p className="title">{`${user.name} 님의 ${catN2S[cat]} 설명입니다.`}</p>
                    {descriptionData}
                </div>
            </div>
        </section>
    );
};

export default ResultPage;
