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
            const response = await fetch(`http://127.0.0.1:8000/api/checkId/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                }),
            });
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
                `http://127.0.0.1:8000/api/checkEmail/`,
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
        const response = await fetch(`http://127.0.0.1:8000/api/mailSend/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        });
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
        const newId = e.target.value;
        setId(newId);
        setIdMsg("");
        setIdIsDuplicate(false);

        // 아이디 길이 검증 추가
        if (newId.length < 4) {
            setIdMsg("아이디는 최소 4자 이상이어야 합니다.");
            setIdMsgColor("red");
        }
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
                                <option value="1">개발</option>
                                <option value="2">인사</option>
                                <option value="3">기획</option>
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
                                <h3>제 1 장 총칙</h3>
                                <h4>제 1 조 (목적)</h4>본 약관은 (주)제이피
                                이노베이션(이하 “회사”라 합니다)이 운영하는
                                웹사이트 ‘어반런드렛’ (www.urbanlaunderette.com)
                                (이하 “웹사이트”라 합니다)에서 제공하는 온라인
                                서비스(이하 “서비스”라 한다)를 이용함에 있어
                                사이버몰과 이용자의 권리, 의무 및 책임사항을
                                규정함을 목적으로 합니다.
                                <h4>제 2 조 (용어의 정의)</h4>
                                본 약관에서 사용하는 용어는 다음과 같이
                                정의한다. “웹사이트”란 회사가 재화 또는 용역을
                                이용자에게 제공하기 위하여 컴퓨터 등
                                정보통신설비를 이용하여 재화 또는 용역을 거래 할
                                수 있도록 설정한 가상의 영업장을 말하며, 아울러
                                사이버몰을 운영하는 사업자의 의미로도
                                사용합니다. “이용자”란 “웹사이트”에 접속하여
                                서비스를 이용하는 회원 및 비회원을 말합니다.
                                <br />
                                “회원”이라 함은 “웹사이트”에 개인정보를 제공하여
                                회원등록을 한 자로서, “웹사이트”의 정보를
                                지속적으로 제공받으며, “웹사이트”이 제공하는
                                서비스를 계속적으로 이용할 수 있는 자를
                                말합니다. “비회원”이라 함은 회원에 가입하지
                                않고, “웹사이트”이 제공하는 서비스를 이용하는
                                자를 말합니다.
                                <br />
                                “ID”라 함은 이용자가 회원가입당시 등록한 사용자
                                “개인이용문자”를 말합니다.
                                <br />
                                “멤버십”이라 함은 회원등록을 한 자로서, 별도의
                                온/오프라인 상에서 추가 서비스를 제공 받을 수
                                있는 회원을 말합니다.
                                <br />
                                <h4>제 3 조 (약관의 공시 및 효력과 변경)</h4>
                                본 약관은 회원가입 화면에 게시하여 공시하며
                                회사는 사정변경 및 영업상 중요한 사유가 있을
                                경우 약관을 변경할 수 있으며 변경된 약관은
                                공지사항을 통해 공시한다 본 약관 및 차후
                                회사사정에 따라 변경된 약관은 이용자에게
                                공시함으로써 효력을 발생한다.
                                <br />
                                <h4>제 4 조 (약관 외 준칙)</h4>본 약관에
                                명시되지 않은 사항이 전기통신기본법,
                                전기통신사업법, 정보통신촉진법,
                                ‘전자상거래등에서의 소비자 보호에 관한 법률’,
                                ‘약관의 규제에관한법률’, ‘전자거래기본법’,
                                ‘전자서명법’, ‘정보통신망 이용촉진등에 관한
                                법률’, ‘소비자보호법’ 등 기타 관계 법령에
                                규정되어 있을 경우에는 그 규정을 따르도록 한다.
                                <h3>제 2 장 이용계약</h3>
                                <h4>제 5 조 (이용신청)</h4>
                                이용신청자가 회원가입 안내에서 본 약관과
                                개인정보보호정책에 동의하고 등록절차(회사의 소정
                                양식의 가입 신청서 작성)를 거쳐 ‘확인’ 버튼을
                                누르면 이용신청을 할 수 있다. 이용신청자는
                                반드시 실명과 실제 정보를 사용해야 하며 1개의
                                생년월일에 대하여 1건의 이용신청을 할 수 있다.
                                실명이나 실제 정보를 입력하지 않은 이용자는
                                법적인 보호를 받을 수 없으며, 서비스 이용에
                                제한을 받을 수 있다.
                                <br />
                                <h4>제 6 조 (이용신청의 승낙)</h4>
                                회사는 제5조에 따른 이용신청자에 대하여 제2항 및
                                제3항의 경우를 예외로 하여 서비스 이용을
                                승낙한다. 회사는 아래 사항에 해당하는 경우에 그
                                제한사유가 해소될 때까지 승낙을 유보할 수 있다.
                                <br />
                                가. 서비스 관련 설비에 여유가 없는 경우
                                <br />
                                나. 기술상 지장이 있는 경우
                                <br />
                                다. 기타 회사 사정상 필요하다고 인정되는 경우
                                <br />
                                회사는 아래 사항에 해당하는 경우에 승낙을 하지
                                않을 수 있다.
                                <br />
                                가. 다른 사람의 명의를 사용하여 신청한 경우
                                <br />
                                나. 이용자 정보를 허위로 기재하여 신청한 경우
                                <br />
                                다. 사회의 안녕질서 또는 미풍양속을 저해할
                                목적으로 신청한 경우
                                <br />
                                라. 기타 회사가 정한 이용신청 요건이 미비한 경우
                                <br />
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
