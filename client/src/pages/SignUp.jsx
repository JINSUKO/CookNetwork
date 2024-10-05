/* 회원가입 페이지
*/

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Policy from '../components/Policy';
import SignUpStyles from '../assets/styles/SignUp.module.css';


function SignUp({ onSignUp }) {   // onSignUp props로 handleSignUp 함수를 전달
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_HOST_IP;
  const [user, setUser] = useState({
    userId: '',
    password: '',
    passwordVerify: '',
    nickname: '',
    userSex: '',
    userEmail: ''
  });
  const { userId, password, passwordVerify, nickname, userSex, userEmail } = user;
  // console.log(user)

  const emailAuthNumServer = useRef(null);
  const emailAuthNumInput = useRef(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknamehecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [isClickedEmailAuth, setIsClickedEmailAuth] = useState(false);
  const [isDisabledEmailAuthNum, setIsDisabledEmailAuthNum] = useState(true);
  const [checked, setChecked] = useState(false);

  // onChange 함수 
  const handleChange = (event) => {
    // validateField(event)
    const { name, value } = event.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
    validateField(name, value);
  };

  // 유효성검사 
  let isId = false;
  const validateField = (name, value) => {   // 유효성 검사 함수 validateField
    let inputError = {};    // inputError 객체

    // 정규식 패턴
    const regId = /^[0-9a-z]{8,16}$/;
    const regPw = /^[0-9a-zA-Z]{8,16}$/;
    const regNickname = /^[a-zA-Z가-힣]{2,16}$/;
    const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // console.log(event.target.name)
    // console.log(event.target.value)
    // 아이디
    // setUser(preUser => ({...preUser, ...Newuser}))

      // 이메일 인증 후에 작성한 이메일에 변동이 생기면 인증을 취소한다.
      setIsEmailChecked(false);
      setIsEmailAvailable(false);
      setIsClickedEmailAuth(false);
      emailAuthNumInput.current = '';
      emailAuthNumServer.current = '';
      setIsDisabledEmailAuthNum(false);

    // console.log(user) // preUser
    if (name === "userId" && !regId.test(value)) {
      inputError.userId = "8-16자 영어 소문자+숫자로 작성하세요.";
      isId = false;
    } else {
      isId = true;
      inputError.userId = "";
    }
    console.log(isId);
    // 비밀번호
    // console.log(user.password)
    if (name === "password" && !regPw.test(value)) {
      inputError.password = "8-16자 영어+숫자로 작성하세요.";
    } else {
      inputError.password = "";
    }
    // 비밀번호 확인
    // console.log(event.target.value)
    if (name === "passwordVerify" && value !== user.password) {
      inputError.passwordVerify = "비밀번호가 일치하지 않습니다.";
    } else {
      inputError.passwordVerify = "";
    }
    // 이메일
    if (name === "userEmail" && !regEmail.test(value)) {
      inputError.userEmail = "올바른 이메일 주소를 입력하세요.";
    } else {
      inputError.userEmail = "";
    }
    // 닉네임 
    if (name === "nickname" && !regNickname.test(value)) {
      inputError.nickname = "닉네임은 한글 또는 영문 2~16자로 작성하세요.";
    } else {
      inputError.nickname = "";
    }
    // 성별
    if (name === "userSex" && value === "") {
      inputError.userSex = "성별을 선택해주세요.";
    } else {
      inputError.userSex = "";
    }
    // 입력 누락 검사
    if (!userId || !password || !passwordVerify || !nickname || !userSex || !userEmail) {
      errors.general = "모든 필드는 필수입니다.";   // general: 입력 누락 등 오류메시지 저장하는 키
    }

    console.log(inputError)
    setErrors(prevErrors => ({
      ...prevErrors,
      ...inputError
    }));

    return Object.keys(inputError).length === 0;  // 유효성검사 함수 Boolean 값 반환
  }

  // 아이디 중복확인
  const idCheck = async (e) => {
    // e.preventdefault();
    if (!user.userId) {
      alert('아이디를 입력해주세요.');
      setIsIdChecked(false);
      setIsIdAvailable(false);
      return;
    }
    // 아이디 유효성 검사 (중복확인 이후 아이디를 수정했을 때)
    const regId = /^[0-9a-z]{8,16}$/;
    if (!regId.test(user.userId)) {
      alert('아이디는 8-16자 영어 소문자+숫자로 작성하세요.');
      setIsIdChecked(false);
      setIsIdAvailable(false);
      return;
    }
    // POST 요청
    try {
      const response = await fetch(`${API_URL}/api/check/idcheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: user.userId})
      });
      setIsIdChecked(true);
      if (response.status === 200){     // 아이디 사용가능
        alert("사용 가능한 아이디입니다.");
        setIsIdAvailable(true);
      } else if(response.status === 409){ // 아이디 중복
        alert("이미 사용중인 아이디입니다.")
        setIsIdAvailable(false);
      } else{
        console.log("아이디 중복확인 오류")
        setIsIdAvailable(false);
      }
    } catch (error) {
      console.error('아이디 중복확인 오류:', error)
      setIsIdAvailable(false);
    }
  };

  // 이메일 중복확인
  const emailCheck = async (e) => {
    // e.preventdefault();
    if (!user.userEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (errors.userEmail) {
      alert('올바른 이메일 주소를 입력하세요.')
      return;
    }
    // POST 요청
    try {
      const response = await fetch(`${API_URL}/api/check/emailcheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userEmail: user.userEmail})
      });

      setIsEmailChecked(true);

      if (response.status === 201){     // 아이디 사용가능
        alert("사용 가능한 이메일입니다.");
        // 이메일 인증까지 완료해야 가능한 걸로 바꿈.
        // setIsEmailAvailable(true);
        setIsEmailAvailable(false);

      } else if(response.status === 410){ // 아이디 중복
        alert("이미 사용중인 이메일입니다.")
        setIsEmailAvailable(false);
      } else{
        console.log("이메일 중복확인 오류")
        setIsEmailAvailable(false);
      }
    } catch (error) {
      console.error('이메일 중복확인 오류:', error)
      setIsEmailAvailable(false);
    }
  };

  // 이메일 인증
  const sendEmailAuth = async () => {

    // isEmailChecked false일 때, display: none 속성 적용 중이라 밑의 코드는 어차피 동작하지 않음.
    if (!isEmailChecked) { alert('이메일 중복확인을 먼저 진행해주세요.'); return; }

    alert('이메일로 인증 번호 발송하고 있습니다.')

    try {
      const response = await fetch(`${API_URL}/api/emailAuth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userEmail: user.userEmail})
      })

      const data = await response.json();

      emailAuthNumServer.current = data.authNum;

      console.log('emailAuthNumServer', emailAuthNumServer);

      alert('이메일로 인증 번호를 보냈습니다. \n 인증번호를 입력하고 확인 버튼을 눌러주세요.')
      setIsClickedEmailAuth(true);
      setIsDisabledEmailAuthNum(false);

    } catch (e) {
      console.error(e);
    }
  }

  const emailNumChange = (e) => {
    emailAuthNumInput.current = e.currentTarget.value;
    console.log('emailAuthNumInput', emailAuthNumInput.current);
  }

  const confirmEmailAuth = () => {

    // if (!emailAuthNumInput ) {
    //   alert('값을 입력해주세요.');
    //   return;
    // }

    console.log('emailAuthNumInput',emailAuthNumInput.current)
    console.log('emailAuthNumServer',emailAuthNumServer.current)
    if (emailAuthNumInput.current === emailAuthNumServer.current) {
      setIsEmailAvailable(true);
      setIsDisabledEmailAuthNum(true);

      alert('이메일 인증 확인되었습니다.');
    } else {
      alert('인증 번호를 다시 입력해주세요.');
    }
  }

  // 닉네임 중복확인
  const nicknameCheck = async (e) => {
    // e.preventdefault();
    if (!user.nickname) {
      alert('닉네임을 입력해주세요.');
      setIsNicknameChecked(false);
      setIsNicknameAvailable(false);
      return;
    }
    // 닉네임 유효성 검사 (중복확인 이후 닉네임을 수정했을 때)
    const regNickname = /^[a-zA-Z가-힣]{2,16}$/;
    if (!regNickname.test(user.nickname)) {
      alert('닉네임은 한글 또는 영문 2~16자로 작성하세요.');
      setIsNicknameChecked(false);
      setIsNicknameAvailable(false);
      return;
    }
    // POST 요청
    try {
      const response = await fetch(`${API_URL}/api/check/nicknamecheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({nickname: user.nickname})
      });
      setIsNicknameChecked(true);
      if (response.status === 202){     // 아이디 사용가능
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameAvailable(true);
      } else if(response.status === 411){ // 아이디 중복
        alert("이미 사용중인 닉네임입니다.")
        setIsNicknameAvailable(false);
      } else{
        console.log("닉네임 중복확인 오류")
        setIsNicknameAvailable(false);
      }
    } catch (error) {
      console.error('닉네임 중복확인 오류:', error)
      setIsNicknameAvailable(false);
    }
  };

  // 이용약관 동의 체크박스 
  const handleCheck = () => {
    setChecked(!checked);
  };

  // onSubmit 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 제출 방지
    let inputError = {};   //  
    console.log(user);

    // 누락된 필드가 있는지 검사
    const allFieldsFilled = Object.values(user).every(value => value !== '' && value !== undefined);  // input? user?

    // 아이디 중복확인 누락시
    if (!isIdChecked || !isIdAvailable) {
      setGeneralError("아이디 중복 확인을 해주세요.");
      return;
    }
    // 이메일 중복확인 누락시
    if (!isEmailChecked || !isEmailAvailable) {
      setGeneralError("이메일 중복 확인을 해주세요.");
      return;
    }
    // 제출 전 모든 필드 유효성 검사
    Object.keys(user).forEach(key => {
      if (!validateField(key, user[key])) {
        inputError[key] = errors[key];
      }
    });

    if (Object.keys(inputError).length === 0 && checked) {
      const input = {
        userId: user.userId,
        password: user.password,
        passwordVerify: user.passwordVerify,
        nickname: user.nickname,
        userSex: parseInt(user.userSex),
        userEmail: user.userEmail
      };

      

      if (allFieldsFilled) {
        onSignUp(input);
        alert("회원가입이 성공적으로 완료되었습니다!");
        navigate('/login');
      } else {
        setGeneralError("모든 필드를 입력하고 이용약관에 동의해주세요.")
      }
    } 
  }
    // else {
    //   setErrors(prevErrors => ({
    //     ...prevErrors,
    //     general: "모든 필드를 입력하고 이용약관에 동의해주세요."    //  
    //   }));
    // }
  
    
  return (
    <div className={SignUpStyles.page}>
      <div className={SignUpStyles.titleWrap}>회원가입</div>
      <form onSubmit={handleSubmit} className={SignUpStyles.contentWrap}>
        <div className={SignUpStyles.userInputFrame}>
          <p className={SignUpStyles.infoOptionalText}>아래에 정보를 입력해주세요.</p>

          <div className={SignUpStyles.labelButtonContainer}>
            <label className={SignUpStyles.infoLabelText}>
            아이디</label>
            <button onClick={idCheck} className={SignUpStyles.checkButton}>중복확인</button>
            </div>
            <input
                className={SignUpStyles.userInput}
                type="text"
                placeholder="아이디"
                value={user.userId}
                name="userId"
                onChange={handleChange}/>
          <div className={SignUpStyles.errorMessageWrap}>{errors.userId}</div>

          <div className={SignUpStyles.labelButtonContainer}>
            <label className={SignUpStyles.infoLabelText}>비밀번호</label>
          </div>
            <input
              className={SignUpStyles.userInput}
              type="password"
              placeholder="비밀번호"
              value={user.password}
              name="password"
              onChange={handleChange}
          />
          <div className={SignUpStyles.errorMessageWrap}>{errors.password}</div>
          
          <div className={SignUpStyles.labelButtonContainer}>
            <label className={SignUpStyles.infoLabelText}>비밀번호 확인</label>
          </div>
            <input
              className={SignUpStyles.userInput}
              type="password"
              placeholder="비밀번호 확인"
              name="passwordVerify"
              value={user.passwordVerify}
              onChange={handleChange}
          />
          
          <div className={SignUpStyles.errorMessageWrap}>{errors.passwordVerify}</div>

          <div className={SignUpStyles.labelButtonContainer}>
              <label className={SignUpStyles.infoLabelText}>
              닉네임</label>
              <button onClick={nicknameCheck} className={SignUpStyles.checkButton}>중복확인</button>
          </div>
                <input
                    className={SignUpStyles.userInput}
                    type="text"
                    placeholder="닉네임"
                    value={user.nickname}
                    name="nickname"
                    onChange={handleChange}
                />
          <div className={SignUpStyles.errorMessageWrap}>{errors.nickname}</div>

          <div className={SignUpStyles.labelButtonContainer}>
            <label className={SignUpStyles.infoLabelText}>
              이메일</label>
            <button onClick={emailCheck} className={SignUpStyles.checkButton}>중복확인</button>
          </div>
            <input
                className={SignUpStyles.userInput}
                type="text"
                placeholder="이메일"
                value={user.userEmail}
                name="userEmail"
                onChange={handleChange}
            />
          <button style={{display: isEmailChecked ? 'flex' : 'none', width: 'fit-content', fontSize: '12px'}}
                  onClick={sendEmailAuth}>인증번호 보내기
          </button>
          <input
              className={SignUpStyles.userInput}
              style={{display: isClickedEmailAuth ? 'flex' : 'none'}}
              type="text"
              placeholder="인증번호"
              // value={emailAuthNumInput} // 초기 값
              name="emailAuthNum"
              onChange={emailNumChange}
              disabled={isDisabledEmailAuthNum}
          />
          <button style={{display: isClickedEmailAuth ? 'flex' : 'none', width: 'fit-content', fontSize: '12px'}}
                  onClick={confirmEmailAuth}
                  disabled={isDisabledEmailAuthNum}>확인
          </button>
          <div className={SignUpStyles.errorMessageWrap}>{errors.userEmail}</div>

          <div className={SignUpStyles.inputGroup}>
            <label className={SignUpStyles.infoLabelText}>성별</label>
            <div className={SignUpStyles.userSexRadioGroup}>
              <div className={SignUpStyles.userSexRadioOption}>
                <input
                    className={SignUpStyles.userSexRadio}
                    type="radio"
                    value="0"
                    name="userSex"
                    onChange={handleChange}
                    checked={user.userSex === '0'}
                />
                <label className={SignUpStyles.userSexRadio}>남성</label>
              </div>
              <div className={SignUpStyles.userSexRadioOption}>
                <input
                    className={SignUpStyles.userSexRadio}
                    type="radio"
                    value="1"
                    name="userSex"
                    onChange={handleChange}
                    checked={user.userSex === '1'}
                />
                <label className={SignUpStyles.userSexRadio}>여성</label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <hr></hr>
          <label className={SignUpStyles.checkboxContainer}>
            이용약관 및 개인정보수집 및 이용에 동의합니다.
            <input type="checkbox" checked={checked} onChange={handleCheck}/>
          </label>
          <Policy />
          <hr></hr>
        </div>

        {generalError && (
        <div className={SignUpStyles.errorMessageWrap}>
          {generalError}
        </div>
        )}

        <div>
          <button
            className={SignUpStyles.userButton}
            type="submit"
            // disabled={!isIdAvailable || !isIdChecked || !validateField || !checked}
          >회원가입
          </button>
        </div>
        <div>
          <p className={SignUpStyles.infoOptionalText}>이미 회원이신가요?
            <button
              className={SignUp.loginRedirectButton}
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #666',
                padding: '8px 16px',
                marginLeft: '10px',
                cursor: 'pointer',
                borderRadius: '120px',
                fontSize: '14px',
              }}
            >
              로그인 하러가기</button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;