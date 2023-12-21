import React, { useState, useContext, useCallback } from "react"; // 리액트 및 필요한 모듈 가져오기
import AuthContext from "../context/AuthContext"; // 인증 컨텍스트 가져오기

function Register() {
  // 사용자 입력값을 상태 변수로 관리
  const [name, setName] = useState(""); // 사용자 이름 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [password2, setPassword2] = useState(""); // 비밀번호 확인 상태
  const { registerUser } = useContext(AuthContext); // 사용자 등록 함수
  const [email, setEmail] = useState(""); // 이메일 상태
  const [dept, setDept] = useState("1"); // 부서 선택 상태 (기본값: 부서1)

  // 비밀번호 및 이메일 관련 메시지를 나타내는 상태 변수
  const [pwdMsg, setPwdMsg] = useState(''); // 비밀번호 유효성 메시지
  const [emailMsg, setEmailMsg] = useState(""); // 이메일 유효성 메시지

  // 비밀번호 변경 핸들러
  const onChangePwd = useCallback((e) => {
    // 입력한 비밀번호 값을 가져옵니다.
    const currPwd = e.target.value;

    // 상태 변수 password를 업데이트하여 현재 비밀번호와 동기화합니다.
    setPassword(currPwd);

    // 입력된 비밀번호의 유효성을 검사하고, 메시지를 설정합니다.
    if (!validatePwd(currPwd)) {
      setPwdMsg("영문, 숫자, 특수기호 조합으로 8자리 이상 입력해주세요.");
    } else {
      setPwdMsg("안전한 비밀번호입니다.");
    }
  }, []);

  // 이메일 변경 핸들러
  const onChangeEmail = useCallback(async (e) => {
    // 입력한 이메일 값을 가져옵니다.
    const currEmail = e.target.value;

    // 상태 변수 email을 업데이트하여 현재 이메일과 동기화합니다.
    setEmail(currEmail);

    // 입력된 이메일의 유효성을 검사하고, 메시지를 설정합니다.
    if (!validateEmail(currEmail)) {
      setEmailMsg("이메일 형식이 올바르지 않습니다.");
    } else {
      setEmailMsg("올바른 이메일 형식입니다.");
    }
  }, []);

  // 비밀번호 유효성 검사 함수
  const validatePwd = (password) => {
    return password
      .toLowerCase()
      .match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/);
  };

  // 이메일 유효성 검사 함수
  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/);
  };

  // 회원가입 양식 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 이메일이 올바르지 않은 경우 회원가입 처리를 중단합니다.
    if (!validateEmail(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    // 회원가입 함수 호출
    registerUser(name, password, password2, email, dept);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <hr />
        <div>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
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
          <p style={{ color: validatePwd(password) ? 'green' : 'red' }}>{pwdMsg}</p> {/* 비밀번호 유효성 메시지 */}
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <p style={{ color: password2 === password ? 'green' : 'red' }}>{password2 === password ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}</p> {/* 비밀번호 일치 여부 메시지 */}
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
          <p style={{ color: validateEmail(email) ? 'green' : 'red' }}>{emailMsg}</p> {/* 이메일 유효성 메시지 */}
        </div>
        <div>
          <label htmlFor="dept">Dept</label>
          <select name="dept" id="dept" onChange={(e) => setDept(e.target.value)} value={dept}>
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
