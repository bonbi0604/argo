//이름 받아야 함
//아이디 중복검사

import React, { useState, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState(false);

  const [pwdMsg, setPwdMsg] = useState('');
  const [emailMsg, setEmailMsg] = useState("");

  //비밀번호 메세지
  const onChangePwd = useCallback((e) =>{
    const currPwd = e.target.value;
    setPassword(currPwd);

    if (!validatePwd(currPwd)) {
      setPwdMsg("영문, 숫자, 특수기호 조합으로 8자리 이상 입력해주세요.")
    } else {
      setPwdMsg("안전한 비밀번호입니다.")
    }
  }, [])

  //이메일 메세지
  const onChangeEmail = useCallback( async (e) => {
    const currEmail = e.target.value;
    setEmail(currEmail);

    if (!validateEmail(currEmail)) {
      setEmailMsg("이메일 형식이 올바르지 않습니다.")
    } else {
        setEmailMsg("올바른 이메일 형식입니다.")
      }
    })

  //비밀번호 유효성 검사
  const validatePwd = (password) => {
    return password
      .toLowerCase()
      .match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/);
  };

  //이메일 유효성 검사
  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/);
  };


  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(username, password, password2, email, dept);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <hr />
        <div>
          <label htmlFor="username">사원번호</label>
          <input
            type="text"
            id="username"
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={onChangePwd}
            placeholder="Password"
            required
          />
          <p>{pwdMsg}</p>
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            onChange={e => setPassword2(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <p>{password2 !== password ? "Passwords do not match" : ""}</p>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            onChange={onChangeEmail}
            placeholder="Email"
            required
          />
          <p>{emailMsg}</p>
        </div>
        <div>
          <label htmlFor="dept">Dept</label>
          <select name="dept" id="dept" onClick={e => setDept(e.target.value)}>
            <option value="1">부서1</option>
            <option value="2">부서2</option>
            <option value="3">부서3</option>
          </select>
        </div>
        <button>회원가입</button>
      </form>
    </section>
  );
}

export default Register;