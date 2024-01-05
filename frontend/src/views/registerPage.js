// 중복검사 공백도 들어감
// 아이디 특수문자 사용가능?

import React, { useState, useContext, useCallback } from "react"; // 리액트 및 필요한 모듈 가져오기
import AuthContext from "../context/AuthContext"; // 인증 컨텍스트 가져오기
import "./registerPage.css";
import LoginModal from "../components/LoginModal";

function Register() {
    // 사용자 입력값을 상태 변수로 관리
    const [name, setName] = useState(""); // 사용자 이름 상태
    const [password, setPassword] = useState(""); // 비밀번호 상태
    const [password2, setPassword2] = useState(""); // 비밀번호 확인 상태
    const [email, setEmail] = useState(""); // 이메일 상태
    const [dept, setDept] = useState(""); // 부서 선택 상태
    const [phone, setPhone] = useState("");
    const [id, setId] = useState("");
    const { registerUser } = useContext(AuthContext); // 사용자 등록 함수

    // 확인
    const [confirmPwdMsg, setConfirmPwdMsg] = useState(""); //비번 확인
    const [idIsCuplicate, setIdIsDuplicate] = useState(false); //아이디 중복인지(True,False)
    const [emailIsDuplicate, setEmailIsDuplicate] = useState(false); // 이메일 중복여부(True,False)

    // 메시지
    const [pwdMsg, setPwdMsg] = useState(""); // 비밀번호 유효성 메시지
    const [emailMsg, setEmailMsg] = useState(""); // 이메일 유효성 메시지
    const [idMsg, setIdMsg] = useState(""); // 아이디 중복 메세지

    // warning 색
    const [idMsgColor, setIdMsgColor] = useState("red"); // 초기값을 빨강으로 설정
    const [emailMsgColor, setEmailMsgColor] = useState("red");

    // 이메일 인증 관련
    const [backCode, setBackCode] = useState("");
    const [code, setCode] = useState("");
    const [codeDisplay, setCodeDisplay] = useState("none");
    const [isMailChecked, setMailChecked] = useState(false);

    //약관 동의
    const [isModalOpen, setModalOpen] = useState(false);
    const [isTermsChecked, setTermsChecked] = useState(false);

    const handleCheckboxChange = () => {
        if (isTermsChecked) {
            setTermsChecked(false);
        } else {
            setModalOpen(true);
        }
    };
    const handleModalOpen = () => {
        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        setTermsChecked(true);
    };

    //비밀번호 확인
    const onChangeConfirmPwd = useCallback(
        (e) => {
            const currConfirmPwd = e.target.value;
            setPassword2(currConfirmPwd);

            if (currConfirmPwd !== password) {
                setConfirmPwdMsg("비밀번호가 일치하지 않습니다.");
            } else {
                setConfirmPwdMsg("올바른 비밀번호입니다.");
            }
        },
        [password]
    );

    // 비밀번호 변경 핸들러
    const onChangePwd = useCallback((e) => {
        // 입력한 비밀번호 값을 가져옵니다.
        const currPwd = e.target.value;

        // 상태 변수 password를 업데이트하여 현재 비밀번호와 동기화합니다.
        setPassword(currPwd);

        // 입력된 비밀번호의 유효성을 검사하고, 메시지를 설정합니다.
        if (!validatePwd(currPwd)) {
            setPwdMsg(
                "영문, 숫자, 특수기호( !@#$%^*_+=- ) 조합으로 8자리 이상 입력해주세요."
            );
        } else {
            setPwdMsg("안전한 비밀번호입니다.");
        }
    }, []);

    // 이메일 변경 핸들러
    const onChangeEmail = useCallback(async (e) => {
        setEmailIsDuplicate(false);
        setCodeDisplay("none");
        setCode("");
        setBackCode("");
        setMailChecked(false);
        // 입력한 이메일 값을 가져옵니다.
        const currEmail = e.target.value;

        // 상태 변수 email을 업데이트하여 현재 이메일과 동기화합니다.
        setEmail(currEmail);

        // 입력된 이메일의 유효성을 검사하고, 메시지를 설정합니다.
        if (!validateEmail(currEmail)) {
            setEmailMsg("이메일 형식이 올바르지 않습니다.");
            setEmailMsgColor("red");
        } else {
            setEmailMsg("올바른 이메일 형식입니다.");
            setEmailMsgColor("green");
        }
    }, []);

    // 비밀번호 유효성 검사 함수
    const validatePwd = (password) => {
        return password
            .toLowerCase()
            .match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*_+=-])(?=.*[0-9]).{8,15}$/);
    };

    // 이메일 유효성 검사 함수
    const validateEmail = (email) => {
        return email
            .toLowerCase()
            .match(
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/
            );
    };

    // 아이디 중복체크
    const checkDuplicateId = useCallback(async () => {
        try {
            // 아이디 값이 비어있으면 중복 확인하지 않음
            if (!id) {
                setIdMsg("아이디를 입력해주세요.");
                setIdMsgColor("red");
                return;
            }

            // 백엔드 API 호출하여 아이디 중복 여부 확인
            const response = await fetch(
                `http:// argo12.duckdns.org:8000/api/checkId/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id,
                    }),
                }
            );
            console.log(id);
            const data = await response.json();

            if (response.ok) {
                if (data.isDuplicate) {
                    setIdMsg("이미 사용 중인 아이디입니다.");
                    setIdMsgColor("red");
                } else {
                    setIdMsg("사용 가능한 아이디입니다.");
                    setIdIsDuplicate(true);
                    setIdMsgColor("green");
                }
            } else {
                console.error("Failed to check duplicate id.");
            }
        } catch (error) {
            console.error("Error occurred while checking duplicate id:", error);
        }
    }, [id]);

    // 이메일 중복체크
    const checkDuplicateEmail = useCallback(async () => {
        try {
            // 이메일 값이 비어있으면 중복 확인하지 않음
            if (!email) {
                setEmailMsg("이메일을 입력해주세요.");
                setEmailMsgColor("red");
                return;
            }

            // 백엔드 API 호출하여 이메일 중복 여부 확인
            const response = await fetch(
                `http:// argo12.duckdns.org:8000/api/checkEmail/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                }
            );
            const data = await response.json();

            if (response.ok) {
                if (data.isDuplicate) {
                    setEmailMsg("이미 사용 중인 이메일입니다.");
                    setEmailMsgColor("red");
                } else {
                    setEmailMsg("사용 가능한 이메일입니다.");
                    setEmailMsgColor("green");
                    setCodeDisplay("");
                }
            } else {
                console.error("Failed to check duplicate id.");
            }
        } catch (error) {
            console.error("Error occurred while checking duplicate id:", error);
        }
    }, [email]);

    /**
     * 이메일을 보낸 후 인증 검사 과정.
     * TODO: 승연이가 여기 주석 예쁘게 써줘~ 부탁해!
     */
    const mailSend = useCallback(async () => {
        setMailChecked(true);
        const response = await fetch(
            `http:// argo12.duckdns.org:8000/api/mailSend/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            }
        );
        const data = await response.json();
        console.log(data);
        setBackCode(data.code);
    }, [email]);

    const validateCode = (code) => {
        return code === backCode;
    };

    // 인증번호 검사
    const checkCode = (e) => {
        if (code === backCode) {
            setEmailMsg("인증되었습니다.");
            setEmailMsgColor("green");
            setCodeDisplay("none");
            setEmailIsDuplicate(true);
        } else {
            setEmailMsg("잘못된 인증번호입니다.");
            setEmailMsgColor("red");
        }
    };

    // 부서 선택했는지
    const validateDept = (dept) => {
        return dept !== "";
    };

    const idChange = (e) => {
        setId(e.target.value);
        setIdMsg("");
        setIdIsDuplicate(false);
    };

    // 검사 함수로 정리
    // const isEmailValid = validateEmail(email);
    const isPwdValid = validatePwd(password);
    const isCodeValid = validateCode(code);
    const isConfirmPwd = password === password2;
    const isDeptValid = validateDept(dept);
    // const isDuId = checkDuplicateId(id);
    // const isDuEmail = checkDuplicateEmail(email);

    // 검사를 묶기
    const isAllValid =
        idIsCuplicate &&
        emailIsDuplicate &&
        isPwdValid &&
        isConfirmPwd &&
        isCodeValid &&
        isDeptValid &&
        isTermsChecked;

    // 회원가입 양식 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        // 회원가입 함수 호출
        registerUser(name, password, password2, email, dept, phone, id);
    };

    return (
        <section
            style={{
                height: "auto",
                minHeight: "calc(100% - 5em)",
                display: "flex",
            }}
        >
            <div className="regloginSection">
                <div id="regFormDiv">
                    <form onSubmit={handleSubmit} className="registForm">
                        <div className="regTitle">회원가입</div>
                        <div className="regContent">
                            <input
                                type="text"
                                id="name"
                                onChange={(e) => setName(e.target.value)}
                                placeholder="이름"
                                required
                            />
                        </div>
                        <div className="regContent">
                            <input
                                type="text"
                                id="id"
                                onChange={idChange}
                                placeholder="아이디"
                                required
                                // disabled={idIsCuplicate}
                            />
                            <button type="button" onClick={checkDuplicateId}>
                                중복 확인
                            </button>
                            <p style={{ color: idMsgColor }}>{idMsg}</p>
                        </div>
                        <div className="regContent">
                            <input
                                type="password"
                                id="password"
                                onChange={onChangePwd}
                                placeholder="비밀번호"
                                required
                            />
                            <p
                                style={{
                                    color: validatePwd(password)
                                        ? "green"
                                        : "red",
                                }}
                            >
                                {pwdMsg}
                            </p>{" "}
                            {/* 비밀번호 유효성 메시지 */}
                        </div>
                        <div className="regContent">
                            <input
                                type="password"
                                id="confirm-password"
                                onChange={onChangeConfirmPwd}
                                placeholder="비밀번호 확인"
                                required
                            />
                            <p
                                style={{
                                    color:
                                        password2 === password
                                            ? "green"
                                            : "red",
                                }}
                            >
                                {confirmPwdMsg}
                            </p>{" "}
                            {/* 비밀번호 일치 여부 메시지 */}
                        </div>
                        <div className="regContent">
                            <input
                                type="text"
                                id="email"
                                onChange={onChangeEmail}
                                placeholder="이메일"
                                // disabled={emailIsDuplicate}
                                required
                            />
                            <button type="button" onClick={checkDuplicateEmail}>
                                중복 확인
                            </button>
                            <p style={{ color: emailMsgColor }}>{emailMsg}</p>

                            <div
                                style={{ display: codeDisplay }}
                                id="emailCheckDiv"
                            >
                                <input
                                    type="text"
                                    id="code"
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Code"
                                    value={code}
                                    required
                                />
                                {isMailChecked ? (
                                    <button onClick={checkCode} type="button">
                                        확인
                                    </button>
                                ) : (
                                    <button onClick={mailSend} type="button">
                                        인증번호 보내기
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="regContent">
                            <input
                                type="text"
                                id="phone"
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="폰 번호  ex) 01012345678"
                                required
                            />
                        </div>
                        <div className="regContent">
                            <select
                                name="dept"
                                id="dept"
                                onChange={(e) => setDept(e.target.value)}
                                value={dept}
                            >
                                <option value="">부서 선택</option>
                                <option value="1">부서1</option>
                                <option value="2">부서2</option>
                                <option value="3">부서3</option>
                            </select>
                        </div>
                        <div id="terms">
                            <label id="terms_label">
                                <input
                                    type="checkbox"
                                    checked={isTermsChecked}
                                    onChange={handleCheckboxChange}
                                />
                                약관 동의
                            </label>
                            <button onClick={handleModalOpen} type="button">
                                약관 보기
                            </button>
                            <LoginModal
                                isOpen={isModalOpen}
                                onClose={handleModalClose}
                            >
                                약관 내용이 여기에 나타납니다.
                            </LoginModal>
                        </div>
                        <button
                            id="regBtn"
                            type="submit"
                            disabled={!isAllValid}
                        >
                            회원가입
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Register;
