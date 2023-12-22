import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// sanity check - 추후 완성되면 지우기
console.log("header menu");

// 상단 네비게이션 바
const HeaderMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);

  const toggleHeader = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header-menu">
      <div className="header-container">
        <div className="main-logo">
          <Link to="/" className="header-logo">
            <h1>ARGO</h1>
          </Link>
        </div>
        <div className="header-body">
          {/*
            로그인 관리.
            로그인 여부에 따라 보이는 내용이 다르도록
          */}
          {
          /** header navigation items
           * designed to be different whether if user is logged in or not
          */
            <>
              <Link to="/" className="header-links">
                Home
              </Link>
              {/** 역량개발 페이지로 이동 TODO: 링크 추가 */}
              <Link to="/" className="header-links">
                역량개발
              </Link>
              {/** 역량평가 페이지로 이동 TODO: 링크 추가 */}
              <Link to="/" className="header-links">
                역량평가
              </Link>
              {/** 게시판으로 이동 TODO: 링크 추가 */}
              <Link to="/" className="header-links">
                게시판
              </Link>
            </>
          }
        </div>
        <div className="header-login">
          {user ? (
            <button className="logout-button" onClick={logoutUser}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderMenu;