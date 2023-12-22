import { useContext } from "react"; // 리액트에서 useContext 모듈을 가져옵니다.
import UserInfo from "../components/UserInfo"; // UserInfo 컴포넌트를 가져옵니다.
import AuthContext from "../context/AuthContext"; // 커스텀 인증 컨텍스트를 가져옵니다.
import "./homePage.css"

console.log("homepage"); // "homepage"을 콘솔에 출력합니다.

const Home = () => {
  const { user } = useContext(AuthContext); // AuthContext에서 user 정보를 가져옵니다.

  return (
    <>
    <div className="main-section">
      <section>
        {/* user가 존재하는 경우 UserInfo 컴포넌트를 렌더링합니다. */}
        {user && <UserInfo user={user} />}
        <h1>You are on home page!</h1> {/* 홈 페이지 안내 메시지 */}
      </section>
    </div>
    </>
  )
}

export default Home;
