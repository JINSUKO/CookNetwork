/* 회원가입 페이지
[ ] 유효성 검사 에러메시지 보완 
[ ] 이메일 틀린 형식으로 중복확인시 사용가능하다고 뜨는 문제 
*/

import React, {useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import SignUpStyles from '../assets/styles/SignUp.module.css';


function SignUp({ onSignUp }) {   // onSignUp props로 handleSignUp 함수를 전달
  const API_URL = import.meta.env.VITE_HOST_IP;
  const [user, setUser] = useState({
    userId: '',
    password: '',
    passwordVerify: '',
    nickname: '',
    userSex: 0,
    userEmail: ''
  });

  const { userId, password, passwordVerify, nickname, userSex, userEmail } = user;
  console.log(user)

  const emailAuthNumServer = useRef(null);
  const emailAuthNumInput = useRef(null);


  // onChange 함수 
  const handleChange = (event) => {
    validateForm(event)
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value
    })
  }


  // 유효성검사 
  const [errors, setErrors] = useState({});
  let isId = false;
  const validateForm = (event) => {   // 유효성 검사 함수 validateForm
    let inputError = {};    // inputError 객체
    event.preventDefault();   // 제출 방지

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

    console.log(user) // preUser
    if (event.target.name === "userId"&& !regId.test(event.target.value)) {
      inputError.userId = "8-16자 영어 소문자+숫자로 작성하세요.";
      isId = false;
    } else {
      isId = true;
    }
    console.log(isId);
    // 비밀번호
    // console.log(user.password)
    if (!regPw.test(user.password)) {
      inputError.password = "8-16자 영어+숫자로 작성하세요.";
    } else {
      inputError.pasword = "";
    }
    // 비밀번호 확인
    // console.log(event.target.value)
    if (user.password !== user.passwordVerify) {
      inputError.passwordVerify = "비밀번호가 일치하지 않습니다.";
    } else {
      inputError.pasword = "";
    }
    // 이메일
    if (!regEmail.test(user.userEmail)) {
      inputError.userEmail = "올바른 이메일 주소를 입력하세요.";
    } else {
      inputError.pasword = "";
    }
    // 닉네임 
    if (!regNickname.test(user.nickname)) {
      inputError.nickname = "닉네임은 한글 또는 영문 2~16자로 작성하세요.";
    } else {
      inputError.pasword = "";
    }
    // 성별
    if (!user.userSex) {
      inputError.userSex = "성별을 선택해주세요.";
    } else {
      inputError.pasword = "";
    }
    // 입력 누락 검사
    if (!userId || !password || !passwordVerify || !nickname || !userSex || !userEmail) {
      inputError.general = "모든 필드는 필수입니다.";   // general: 입력 누락 등 오류메시지 저장하는 키
    }


    console.log(inputError)
    setErrors(inputError);

    // 유효성검사 함수 Boolean 값 반환
    return Object.keys(inputError).length === 0;
  }

  // 아이디 중복확인
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  const idCheck = async (e) => {
    // e.preventdefault();

    if (!user.userId) {
      alert('아이디를 입력해주세요.');
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

      if (response.status === 200){     // 200: 아이디 사용가능
        alert("사용 가능한 아이디입니다.");
        setIsIdAvailable(true);
      } else if(response.status === 409){ // 409: 아이디 중복
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
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

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

      if (response.status === 201){     // 200: 아이디 사용가능
        alert("사용 가능한 이메일입니다.");
        // 이메일 인증까지 완료해야 가능한 걸로 바꿈.
        // setIsEmailAvailable(true);
        setIsEmailAvailable(false);

      } else if(response.status === 410){ // 409: 아이디 중복
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
  const [isClickedEmailAuth, setIsClickedEmailAuth] = useState(false);
  const [isDisabledEmailAuthNum, setIsDisabledEmailAuthNum] = useState(true);

  const sendEmailAuth = async () => {

    // isEmailAvailable가 false일 때, display: none 속성 적용 중이라 밑의 코드는 동작하지 않음.
    if (!isEmailAvailable) { alert('이메일 중복확인을 먼저 진행해주세요.'); return; }

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
  const [isNicknamehecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  const nicknameCheck = async (e) => {
    // e.preventdefault();

    if (!user.nickname) {
      alert('닉네임을 입력해주세요.');
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

      if (response.status === 202){     // 200: 아이디 사용가능
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameAvailable(true);
      } else if(response.status === 411){ // 409: 아이디 중복
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
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };

  //onSubmit 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 제출 방지
    console.log(user);
    
    // 아이디 중복확인 누락시
    if (!isIdChecked || !isIdAvailable) {
      setErrors(prevErrors => ({
        ...prevErrors,
        general: "아이디 중복 확인을 해주세요."
      }));
      return;
    }

    // 이메일 중복확인 누락시
    if (!isEmailChecked || !isEmailAvailable) {
      setErrors(prevErrors => ({
        ...prevErrors,
        general: "이메일 중복 확인을 해주세요."
      }));
      return;
}
    // 유효성 검사 후 제출하기
    if (validateForm(event) && checked){
      const input={
        userId: user.userId,
        password: user.password,
        passwordVerify: user.passwordVerify,
        nickname: user.nickname,
        userSex: parseInt(user.userSex),
        userEmail: user.userEmail
      }

      const allFieldsFilled = Object.values(input).every(value => value !== '' && value !== undefined);

      if (allFieldsFilled) {
        onSignUp(input);
        alert("회원가입이 성공적으로 완료되었습니다!"); // 성공 메시지 alert 추가
        location.href = '/login';
        
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          general: "모든 필드를 입력해주세요."
        }));
      }
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        general: "모든 필드를 입력하고 이용약관에 동의해주세요."
      }));
    }
  }
    
  return (
    <div className={SignUpStyles.page}>
      <div className={SignUpStyles.titleWrap}>회원가입</div>
      <form onSubmit={handleSubmit} className={SignUpStyles.contentWrap}>
        <div className={SignUpStyles.userInputFrame}>
          <p className={SignUpStyles.infoOptionalText}>아래에 정보를 입력해주세요.</p>
          <label className={SignUpStyles.infoLabelText}>아이디
            <button onClick={idCheck}>중복확인</button>
            <input
                className={SignUpStyles.userInput}
                type="text"
                placeholder="아이디"
                value={user.userId}
                name="userId"
                onChange={handleChange}/>

          </label>
          <div className={SignUpStyles.errorMessageWrap}>{errors.userId}</div>
          <label className={SignUpStyles.infoLabelText}>비밀번호<input
              className={SignUpStyles.userInput}
              type="password"
              placeholder="비밀번호"
              value={user.password}
              name="password"
              onChange={handleChange}
          />
          </label>
          <div className={SignUpStyles.errorMessageWrap}>{errors.password}</div>
          <label className={SignUpStyles.infoLabelText}>비밀번호 확인<input
              className={SignUpStyles.userInput}
              type="password"
              placeholder="비밀번호 확인"
              name="passwordVerify"
              value={user.passwordVerify}
              onChange={handleChange}
          />
          </label>
          <div className={SignUpStyles.errorMessageWrap}>{errors.passwordVerify}</div>
          <label className={SignUpStyles.infoLabelText}>닉네임
            <button onClick={nicknameCheck}>중복확인</button>

            <input
                className={SignUpStyles.userInput}
                type="text"
                placeholder="닉네임"
                value={user.nickname}
                name="nickname"
                onChange={handleChange}
            />
            <div className={SignUpStyles.errorMessageWrap}>{errors.nickname}</div>
          </label>
          <label className={SignUpStyles.infoLabelText}>이메일
            <button onClick={emailCheck}>중복확인</button>
            <input
                className={SignUpStyles.userInput}
                type="text"
                placeholder="이메일"
                value={user.userEmail}
                name="userEmail"
                onChange={handleChange}
            />
          </label>
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

          <div value={userSex} className={SignUpStyles.inputGroup}>
            <label className={SignUpStyles.infoLabelText}>성별</label>
            <div className={SignUpStyles.userSexRadioGroup}>
              <div className={SignUpStyles.userSexRadioOption}>
                <input
                    className={SignUpStyles.userSexRadio}
                    type="radio"
                    value="0"
                    name="userSex"
                    onChange={handleChange}
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
                />
                <label className={SignUpStyles.userSexRadio}>여성</label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <hr></hr>
          <label className={SignUpStyles.infoOptionalText}>
            이용약관 및 개인정보수집 및 이용에 동의합니다.
            <input type="checkbox" checked={checked} onChange={handleCheck}/>
          </label>
          <div className={SignUpStyles.checkboxContainer}>이용약관</div>
          <div className={SignUpStyles.checkboxContainer}>개인정보 수집 및 이용 동의</div>
          <hr></hr>
        </div>
        <div>
          <button
            className={SignUpStyles.userButton}
            type="submit"
            disabled={!isIdAvailable || !isIdChecked || !validateForm || !checked}
          >회원가입
          </button>
        </div>
        <div>
          <p className={SignUpStyles.infoOptionalText}>이미 회원이신가요? 
            <Link to="/api/login"> 로그인 하러가기</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;