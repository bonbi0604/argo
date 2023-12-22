import { useContext } from "react"; // 리액트에서 useContext 모듈을 가져옵니다.
import UserInfo from "../components/UserInfo"; // UserInfo 컴포넌트를 가져옵니다.
import AuthContext from "../context/AuthContext"; // 커스텀 인증 컨텍스트를 가져옵니다.
import "./homePage.css"

const CommunicationPage = () => {
  const { user } = useContext(AuthContext); // AuthContext에서 user 정보를 가져옵니다.

  return (
    <>
    <div height="5rem" padding-top="5rem" margin-bottom="5rem">&nbsp;</div>
    <div className="main-section">
      <section>
        {/* user가 존재하는 경우 UserInfo 컴포넌트를 렌더링합니다. */}
        {user && <UserInfo user={user} />}
        <h1>You are on CommunicationPage!</h1> {/* 홈 페이지 안내 메시지 */}
      </section>
    </div>
    </>
  )
}

export default CommunicationPage;