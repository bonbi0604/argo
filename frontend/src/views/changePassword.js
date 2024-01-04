import { useContext, useState, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./loginPage.css"

const LoginPage = () => {
    const { changePassword } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [confirmPwdMsg, setConfirmPwdMsg] = useState("");
    const [pwdMsg, setPwdMsg] = useState('');

    // 비밀번호 유효성 검사 함수
    const validatePwd = (newPassword) => {
    return newPassword
        .toLowerCase()
        .match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*_+=-])(?=.*[0-9]).{8,15}$/);
    };
    // 비밀번호 변경 핸들러
    const onChangePwd = useCallback((e) => {
        // 입력한 비밀번호 값을 가져옵니다.
        const currPwd = e.target.value;

        // 상태 변수 password를 업데이트하여 현재 비밀번호와 동기화합니다.
        setNewPassword(currPwd);

        // 입력된 비밀번호의 유효성을 검사하고, 메시지를 설정합니다.
        if (!validatePwd(currPwd)) {
            setPwdMsg("영문, 숫자, 특수기호( !@#$%^*_+=- ) 조합으로 8자리 이상 입력해주세요.");
        } else {
            setPwdMsg("안전한 비밀번호입니다.");
        }
    }, []);

    //비밀번호 확인
    const onChangeConfirmPwd = useCallback((e) => {
        const currConfirmPwd = e.target.value;
        setNewPassword2(currConfirmPwd);

        if (currConfirmPwd !== newPassword) {
            setConfirmPwdMsg("비밀번호가 일치하지 않습니다.")
        } else {
            setConfirmPwdMsg("올바른 비밀번호입니다.")
        }
    }, [setNewPassword])

    const handleSubmit = e => {
        e.preventDefault(); // 폼 제출 기본 동작을 막습니다. 페이지 리로드를 방지합니다.

        const oldPassword = e.target.oldPassword.value;

        changePassword(oldPassword, newPassword, newPassword2);
    };

    const isPwdValid = validatePwd(newPassword);
    const isConfirmPwd = newPassword === newPassword2;
    const isAllValid = isConfirmPwd && isPwdValid

    return (
    <section>
        <div className="regloginSection">
            <div id="loginFormDiv">
                <form onSubmit={handleSubmit} className="loginForm">
                    <div className="loginTitle">비밀번호 변경</div>
                    <div className="loginContent">
                        <input type="password" id="oldPassword" name="oldPassword" placeholder="현재 비밀번호" />
                    </div>
                    <div className="loginContent">
                        <input type="password" id="newPassword" name="newPassword" onChange={onChangePwd} placeholder="새로운 비밀번호" />
                        <p style={{ color: validatePwd(newPassword) ? 'green' : 'red' }}>{pwdMsg}</p>
                    </div>
                    <div className="loginContent">
                        <input type="password" id="newPassword2" name="newPassword2" onChange={onChangeConfirmPwd} placeholder="비밀번호 확인" />
                        <p style={{ color: newPassword2 === newPassword ? 'green' : 'red' }}>{confirmPwdMsg}</p>
                    </div>
                    <button type="submit" id="loginBtn" disabled={!isAllValid}>비밀번호 변경</button> {/* 폼 제출을 위한 로그인 버튼 */}
                </form>
            </div>
        </div>
    </section>
  );
};

export default LoginPage;
