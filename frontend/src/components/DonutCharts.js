import DonutChart from "./DonutChart";
import "./DonutCharts.css";

const DonutCharts = ({data}) => {
    const sizelist = ['13em', '16em', '19em', '22em', '25em']
    const colorlist = ['#FA9DA3', '#FAE3A9', '#BDD98E', '#9DC2ED', '#E2ACF5']

    return (
        <div className="donutcharts">
            {Object.entries(data).map(([cat, { avg, score }], index) => 
                <DonutChart key={cat} cat={cat} color={colorlist[index]} score={score} size={sizelist[index]} />
            )}
        </div>
    );
};

export default DonutCharts;
