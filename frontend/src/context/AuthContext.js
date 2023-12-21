import { createContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext(); // Context 생성

export default AuthContext;



export const AuthProvider = ({ children }) => {

  

  // localStorage에 authTokens이 있을 경우 가져와서 authTokens에 넣는다.
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
  ); 

  // localStorage에 authTokens이 있을 경우 jwt_decode로 authTokens를 decode해서 user 정보에 넣는다.
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null
  ); 

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // react router dom 6버전 이상부터는 useHistory대신 useNavigate 사용

  const loginUser = async (email, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await response.json();

    // 로그인에 성공했을 경우 홈으로 이동
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      alert("Something went wrong!");
    }
  };
  
  const registerUser = async (name, password, password2, email, dept) => {
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        password,
        password2,
        email,
        dept
      })
    });
    if (response.status === 201) {
      navigate("/login");
    } else {
      alert("Something went wrong!");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData} >{children}</AuthContext.Provider>
  );
}