import "./CommunicationSummary.css";
import CommunicationChatbot from "../components/CommunicationChatbot";

const CommunicationStudy = ({stopped, stateN, setStateN, setStopped}) => {
  return (
    <div style={{width:'100%'}}>
        <CommunicationChatbot />
    </div>
  )
}

export default CommunicationStudy;