import { useContext } from "react"; // 리액트에서 useContext 모듈을 가져옵니다.
import AuthContext from "../context/AuthContext"; // 커스텀 인증 컨텍스트를 가져옵니다.

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext); // AuthContext에서 loginUser 함수를 가져옵니다.

  const handleSubmit = e => {
    e.preventDefault(); // 폼 제출 기본 동작을 막습니다. 페이지 리로드를 방지합니다.

    // 폼에서 사용자명(username)과 비밀번호(password)를 가져옵니다.
    const username = e.target.username.value;
    const password = e.target.password.value;

    // 사용자명이 비어 있지 않은 경우에만 loginUser 함수를 호출하여 로그인을 시도합니다.
    username.length > 0 && loginUser(username, password);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>Login </h1>
        <hr />
        <label htmlFor="username">Username</label>
        <input type="text" id="username" placeholder="Enter Username" />
        <br/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Enter Password" />
        <br/>
        <button type="submit">Login</button> {/* 폼 제출을 위한 로그인 버튼 */}
      </form>
    </section>
  );
};

export default LoginPage;
