import DonutChart from "./DonutChart";
import "./DonutCharts.css";
import IconStructure from "../icon/IconStructure";

const colorlist = ['#FA9DA3', '#FAE3A9', '#BDD98E', '#9DC2ED', '#E2ACF5']

const PentagonIcon = () => {
    const icon_list = [
        "M24,11c0-1.568-.752-3.04-2-3.979v-.021c0-1.897-1.327-3.489-3.102-3.898-.409-1.774-2.002-3.102-3.898-3.102-1.194,0-2.267,.526-3,1.357-.733-.832-1.806-1.357-3-1.357-1.896,0-3.489,1.327-3.898,3.102-1.774,.409-3.102,2.001-3.102,3.898v.021c-1.248,.939-2,2.41-2,3.979,0,.886,.235,1.737,.686,2.5-.45,.763-.686,1.614-.686,2.5,0,1.686,.858,3.244,2.267,4.166,.719,2.278,2.812,3.834,5.233,3.834,1.858,0,3.504-.926,4.5-2.342,.996,1.415,2.642,2.342,4.5,2.342,2.422,0,4.515-1.556,5.233-3.834,1.408-.922,2.267-2.48,2.267-4.166,0-.886-.235-1.737-.686-2.5,.45-.763,.686-1.614,.686-2.5ZM7.5,22c-1.634,0-3.033-1.115-3.401-2.712-.065-.281-.248-.52-.502-.656-.985-.528-1.597-1.536-1.597-2.631,0-.675,.234-1.322,.679-1.872,.296-.367,.296-.89,0-1.257-.444-.549-.679-1.196-.679-1.872,0-1.07,.591-2.067,1.543-2.603,.37-.208,.568-.627,.494-1.045-.02-.115-.037-.231-.037-.352,0-1.103,.897-2,2-2,.553,0,1-.448,1-1,0-1.103,.897-2,2-2s2,.897,2,2v4h-2.268c-.346-.598-.992-1-1.732-1-1.105,0-2,.895-2,2s.895,2,2,2c.74,0,1.386-.402,1.732-1h2.268v5h-2.268c-.346-.598-.992-1-1.732-1-1.105,0-2,.895-2,2s.895,2,2,2c.74,0,1.386-.402,1.732-1h2.268v1.5c0,1.93-1.57,3.5-3.5,3.5Zm13.821-7.872c.444,.549,.679,1.196,.679,1.872,0,1.096-.611,2.104-1.597,2.631-.254,.136-.437,.375-.502,.656-.368,1.597-1.768,2.712-3.401,2.712-1.93,0-3.5-1.57-3.5-3.5v-4.5h2c1.654,0,3-1.346,3-3v-.268c.598-.346,1-.992,1-1.732,0-1.105-.895-2-2-2s-2,.895-2,2c0,.74,.402,1.386,1,1.732v.268c0,.551-.448,1-1,1h-2V4c0-1.103,.897-2,2-2s2,.897,2,2c0,.552,.447,1,1,1,1.103,0,2,.897,2,2,0,.121-.018,.237-.037,.352-.074,.418,.124,.837,.494,1.045,.952,.535,1.543,1.533,1.543,2.603,0,.675-.234,1.322-.679,1.872-.296,.367-.296,.89,0,1.257Z",
        "m.5,6.5c0-1.381,1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5-1.119,2.5-2.5,2.5S.5,7.881.5,6.5Zm8.5,14v2.5c0,.552-.448,1-1,1s-1-.448-1-1v-2.5c0-.276-.224-.5-.5-.5,0,0-3.535,0-3.552-.001-1.63-.028-2.948-1.362-2.948-2.999v-4c0-1.654,1.346-3,3-3s3,1.346,3,3v5h.5c1.378,0,2.5,1.122,2.5,2.5Zm-5-2.5v-5c0-.551-.449-1-1-1s-1,.449-1,1v4c0,.551.449,1,1,1h1Zm17-9c1.381,0,2.5-1.119,2.5-2.5s-1.119-2.5-2.5-2.5-2.5,1.119-2.5,2.5,1.119,2.5,2.5,2.5Zm3,4v4c0,1.637-1.318,2.971-2.948,2.999-.017,0-3.552.001-3.552.001-.276,0-.5.224-.5.5v2.5c0,.552-.448,1-1,1s-1-.448-1-1v-2.5c0-1.378,1.122-2.5,2.5-2.5h.5v-5c0-1.654,1.346-3,3-3s3,1.346,3,3Zm-2,0c0-.551-.449-1-1-1s-1,.449-1,1v5h1c.551,0,1-.449,1-1v-4Zm-6,1c0-.552-.448-1-1-1h-6c-.552,0-1,.448-1,1s.448,1,1,1h6c.552,0,1-.448,1-1ZM7,5.048v-2.096c0-1.628,1.324-2.952,2.952-2.952h4.096c1.628,0,2.952,1.324,2.952,2.952v2.096c0,1.533-1.175,2.797-2.672,2.939l-1.39,1.151c-.272.243-.622.365-.977.365-.363,0-.729-.128-1.021-.388l-1.379-1.141c-1.444-.192-2.561-1.431-2.561-2.926Zm2,0c0,.525.427.952.952.952.233,0,.458.081.638.229l1.363,1.128,1.362-1.128c.179-.149.405-.23.638-.23h.096c.525,0,.952-.427.952-.952v-2.096c0-.525-.427-.952-.952-.952h-4.096c-.525,0-.952.427-.952.952v2.096Zm-5,16.952H1c-.552,0-1,.448-1,1s.448,1,1,1h3c.552,0,1-.448,1-1s-.448-1-1-1Zm19,0h-3c-.552,0-1,.448-1,1s.448,1,1,1h3c.552,0,1-.448,1-1s-.448-1-1-1Z",
        "m17.994 2.286a9 9 0 0 0 -14.919 5.536 8.938 8.938 0 0 0 2.793 7.761 6.263 6.263 0 0 1 2.132 4.566v.161a3.694 3.694 0 0 0 3.69 3.69h.62a3.694 3.694 0 0 0 3.69-3.69v-.549a5.323 5.323 0 0 1 1.932-4 8.994 8.994 0 0 0 .062-13.477zm-5.684 19.714h-.62a1.692 1.692 0 0 1 -1.69-1.69s-.007-.26-.008-.31h4.008v.31a1.692 1.692 0 0 1 -1.69 1.69zm4.3-7.741a7.667 7.667 0 0 0 -2.364 3.741h-1.246v-7.184a3 3 0 0 0 2-2.816 1 1 0 0 0 -2 0 1 1 0 0 1 -2 0 1 1 0 0 0 -2 0 3 3 0 0 0 2 2.816v7.184h-1.322a8.634 8.634 0 0 0 -2.448-3.881 7 7 0 0 1 3.951-12.073 7.452 7.452 0 0 1 .828-.046 6.921 6.921 0 0 1 4.652 1.778 6.993 6.993 0 0 1 -.048 10.481z",
        "m17.979,13.024c-1.119-1.116-2.813-1.318-4.14-.607l-4.832-4.832v-3.086c0-1.013-.545-1.956-1.422-2.462L4.604.318C3.673-.22,2.492-.063,1.73.697L.705,1.724C-.056,2.483-.211,3.665.326,4.596l1.719,2.981h0c.506.878,1.45,1.423,2.462,1.423h3.086l4.826,4.826c-.278.508-.426,1.079-.426,1.674,0,.936.365,1.814,1.028,2.476l5.014,5c.658.656,1.554,1.024,2.48,1.024.985,0,2.088-.521,2.718-1.289,1.126-1.372.976-3.475-.341-4.787l-4.913-4.899ZM3.777,6.579l-1.719-2.982c-.086-.148-.061-.337.061-.459l1.025-1.026c.122-.121.311-.147.46-.061l2.98,1.72c.26.15.422.43.422.729v2.5h-2.5c-.3,0-.579-.161-.729-.421Zm17.91,14.863c-.276.337-.666.534-1.097.556-.421.02-.841-.139-1.142-.438l-5.014-5c-.284-.283-.44-.659-.44-1.06s.157-.776.44-1.06c.294-.293.681-.44,1.067-.44s.772.147,1.066.44l4.914,4.899c.596.595.687,1.518.207,2.103Zm-11.25-4.343c.39.392.389,1.024-.002,1.414l-4.477,4.462c-.658.656-1.553,1.024-2.48,1.024-.881,0-2.088-.521-2.718-1.29-1.125-1.371-.976-3.474.342-4.786l5.668-5.655c.39-.39,1.024-.39,1.414.002.39.391.389,1.024-.002,1.414l-5.669,5.655c-.596.595-.688,1.518-.208,2.102.277.338.667.535,1.098.557.426.019.841-.139,1.142-.438l4.478-4.462c.391-.39,1.023-.39,1.415.002Zm-.544-12.465C10.813,2.291,12.917.56,15.384.117c.863-.154,1.73-.157,2.579-.006.666.118,1.203.588,1.402,1.224.229.729,0,1.531-.612,2.145l-2.335,2.242c-.485.485-.564,1.261-.165,1.749.23.281.553.445.911.464.349.017.694-.112.947-.365l2.614-2.521c.486-.486,1.213-.667,1.893-.45.664.209,1.151.762,1.272,1.441.15.848.148,1.717-.006,2.581-.281,1.572-1.1,3.036-2.306,4.123-.191.172-.431.257-.669.257-.273,0-.546-.111-.743-.33-.37-.41-.337-1.043.073-1.413.877-.79,1.472-1.852,1.676-2.988.098-.548.112-1.095.043-1.632l-2.445,2.359c-.635.637-1.53.984-2.448.936-.916-.046-1.776-.481-2.36-1.195-1.042-1.274-.904-3.226.314-4.443l2.334-2.242.009-.009c-.535-.068-1.081-.054-1.625.044-1.788.32-3.313,1.577-3.982,3.279-.201.514-.782.767-1.296.565s-.768-.782-.565-1.296Z",
        "M23.938,10.654l-3.071-8.335c-.423-1.151-1.634-1.781-2.824-1.465l-5.043,1.345V1c0-.552-.448-1-1-1s-1,.448-1,1v1.732l-5.254,1.401c-1.255,.335-2.273,1.263-2.723,2.482L.062,14.654c-.041,.111-.062,.647-.062,.647,0,2.506,2,4.698,4.503,4.698,1.158,0,2.249-.434,3.094-1.236,.891-.846,1.402-2.036,1.402-3.264,0,0-.021-.732-.06-.842L5.87,6.216c.124-.063,.255-.114,.392-.15l4.738-1.264V22H5c-.552,0-1,.448-1,1s.448,1,1,1h14c.552,0,1-.448,1-1s-.448-1-1-1h-6V4.268l4.896-1.306-2.834,7.691c-.041,.111-.062,.647-.062,.647,0,2.506,1.871,4.567,4.26,4.692,1.249,.066,2.434-.371,3.338-1.229,.891-.846,1.402-2.036,1.402-3.264,0,0-.021-.735-.062-.846ZM4.364,17.997c-1.081-.057-1.986-.902-2.266-1.997H6.95c-.1,.499-.35,.954-.729,1.313-.502,.478-1.165,.725-1.856,.683Zm2.208-3.997H2.434l2.083-5.653,2.056,5.653ZM19.5,4.393l2.066,5.607h-4.132l2.066-5.607Zm-.136,9.604c-1.081-.057-1.986-.902-2.266-1.997h4.851c-.1,.499-.35,.954-.729,1.313-.502,.478-1.165,.719-1.856,.683Z"
    ];

    const viewBox_list = ["0 0 128 128", "0 0 128 128", "0 0 128 128", "0 0 128 128", "0 0 128 128"];

    const radius = 18;
    const size = 15;

    const pentagonStyle = {
    //   position: 'relative',
      width: `${size}%`,
      height: `${size}%`,
      top: `calc(50% - ${size/2}%)`,
      left: `calc(50% - ${size/2}%)`,
      position:'absolute',
    //   transform: 'translate(-50%, -50%)'
    };

    const calculatePosition = (index, alpha) => {
        const angle = (index) * (360 / 5);
        const x = (radius*3) * Math.sin(angle * (Math.PI / 180) + alpha);
        const y = -(radius*3) * Math.cos(angle * (Math.PI / 180) + alpha);
        return { x, y };
    };

    const lines = Array.from({ length: 5 }).map((_, index) => {
        const alpha = (Math.PI / 180) * 10;
        const startPosition = calculatePosition(index, alpha);
        const endPosition = calculatePosition((index + 1) % 5, -alpha);

        return (
            <line
                key={index}
                x1={startPosition.x + 50 + "%"}
                y1={startPosition.y + 50 + "%"}
                x2={endPosition.x + 50 + "%"}
                y2={endPosition.y + 50 + "%"}
                stroke="gray"
                strokeWidth="1"
                strokeDasharray="10, 10"

            />
        );
    });

    //transform: `translate(calc(sin(${index * (360 / 5)}deg) * ${radius}em), calc(-1 * cos(${index * (360 / 5)}deg) * ${radius}em))`
    // transform: translate(`${calculatePosition(index, 0).x + 50}%`, `${calculatePosition(index, 0).y+ 50}%`)
    const pentagon = Array.from({ length: 5 }).map((_, index) => (
      <div className="iconStructure" style={{...pentagonStyle, transform: `translate(${calculatePosition(index, 0).x * (100/size) }%, ${calculatePosition(index, 0).y  * (100/size)}%)`}}>
        <IconStructure 
        key={index}
        data={icon_list[index]}
        color={colorlist[index]}
        size={"100%"}
        index={index} radius={radius}
        viewBox={viewBox_list[index]}
        x={`${calculatePosition(index, 0).x + 50}%`} y={`${calculatePosition(index, 0).y+ 50}%`}
        />

      </div>

    ));
  
    return (
        <div className="donutcharts_icon">
            {pentagon}
            {/* 회색 점선 추가 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                {lines}
            </svg>
        </div>
    );
  };

const DonutCharts = ({data}) => {
    // const sizelist = ['13em', '16em', '19em', '22em', '25em']
    const sizelist = ['60%', '70%', '80%', '90%', '100%']
    

    return (
        <>
        <div className="donut_pentagon_chart">
            <div className="donut_pentagon_chart_inner">
                <PentagonIcon />
            </div>
            <div className="donut_pentagon_chart_inner">
                <div className="donutcharts">
                    {Object.entries(data).map(([cat, { avg, score }], index) => 
                        <DonutChart key={cat} cat={cat} color={colorlist[index]} score={score} size={sizelist[index]} />
                    )}
                </div>
            </div>
        </div>

        


        </>

    );
};

export default DonutCharts;
