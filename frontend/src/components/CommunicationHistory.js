import "./CommunicationHistory.css";
import CommunicationHistoryList from "./CommunicationHistoryList";

const CommunicationHistory = ({stopped, stateN, setStateN, setStopped, historyId, setHistoryId}) => {
  return (
    <div className="history_wrapper">
        <div className="history_contents">
          {`${historyId}`}
          
        </div>
        <div className="history_list">
          <CommunicationHistoryList stopped={stopped} stateN={stateN} setStateN={setStateN} setStopped={setStopped} historyId={historyId} setHistoryId={setHistoryId} />
      </div>
    </div>
  )
}

export default CommunicationHistory