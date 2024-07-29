/* 회원가입 페이지
*/

import React, { isValidElement, useState } from 'react';
import UserButton from '../components/UI/UserButton.jsx';
import SignUpStyles from '../assets/styles/SignUp.module.css';


function SignUp() {
  const [user, setUser] = useState({
    userId: '',
    password: '',
    passwordVerify: '',
    nickname: '',
    userSex: '',
    userEmail: ''
  });

  console.log(user)
  const { userId, password, passwordVerify, nickname, userSex, userEmail } = user;
  console.log(user)


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

  const validateForm = (event) => {
    let inputError = {};
    event.preventDefault();

    // 정규식 패턴
    const regId = /^[0-9a-z]{8,16}$/;
    const regPw = /^[0-9a-zA-Z]{8,16}$/;
    const regNickname = /^[a-zA-Z가-힣]{2,16}$/;
    const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 아이디
    if (!regId.test(user.userId)) {
      setUser(prevState => ({ ...prevState, userId: '' }));
      inputError.userId = "8-16자 영어 소문자+숫자로 작성하세요.";
    }
    // 비밀번호
    if (!regPw.test(user.password)) {
      setUser(prevState => ({ ...prevState, pw: '' }));
      inputError.password = "8-16자 영어+숫자로 작성하세요.";
    }
    // 비밀번호 확인
    if (user.password !== user.passwordVerify) {
      setUser(prevState => ({ ...prevState, pw: '', checkpw: '' }));
      inputError.passwordVerify = "비밀번호가 일치하지 않습니다.";
    }
    // 이메일
    if (!regEmail.test(user.userEmail)) {
      inputError.userEmail = "올바른 이메일 주소를 입력하세요.";
    }
    // 닉네임 
    if (!regNickname.test(user.nickname)) {
      setUser(prevState => ({ ...prevState, name: '' }));
      inputError.nickname = "닉네임은 한글 또는 영문 2~16자로 작성하세요.";
    }
    // 성별
    if (!user.userSex) {
      inputError.userSex = "성별을 선택해주세요.";
    }
    // 입력 누락 검사
    if (!userId || !password || !passwordVerify || !nickname || !userSex || !userEmail) {
      inputError.general = "모든 필드는 필수입니다.";
    }

    setErrors(inputError);
    return Object.keys(inputError).length === 0;
  }




  // 이용약관 동의 체크박스 
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // 제출 방지
  }


  return (
    <div className={SignUpStyles.page}>
      <div className={SignUpStyles.titleWrap}>회원가입</div>
      <div className={SignUpStyles.contentWrap}>
        <div className={SignUpStyles.userInputFrame}>
          <p className={SignUpStyles.infoOptionalText}>아래에 정보를 입력해주세요.</p>
          <input
            className={SignUpStyles.userInput}
            type="text"
            placeholder="아이디"
            value={userId}
            name="userId"
            onChange={handleChange} />

          <div className={SingupStyles.errorMessageWrap}>{errors.userId}</div>
          <input
            className={SignUpStyles.userInput}
            type="text"
            placeholder="비밀번호"
            value={password}
            name="password"
            onChange={handleChange}
          />
          <div className={SignUpStyles.errorMessageWrap}></div>
          <input
            className={SignUpStyles.userInput}
            type="text"
            placeholder="비밀번호 확인"
            name="passwordVerify"
            value={passwordVerify}
            onChange={handleChange}
          />
          <div className={SignUpStyles.errorMessageWrap}></div>
          <input
            className={SignUpStyles.userInput}
            type="text"
            placeholder="닉네임"
            value={nickname}
            name="nickname"
            onChange={handleChange}
          />
          <div className={SignUpStyles.errorMessageWrap}></div>
          <input
            className={SignUpStyles.userInput}
            type="text"
            placeholder="이메일"
            value={userEmail}
            name="userEmail"
            onChange={handleChange}
          />

          <div value={userSex}>
            <label className="infoOptionalText">성별<br />
            </label>
            <label>
              남성<input
                className={SignUpStyles.userSexRadio}
                type="radio"
                value="0"
                name="userSex"
                onChange={handleChange} />
            </label>
            <label>
              여성<input
                className={SignUpStyles.userSexRadio}
                type="radio"
                value="1"
                name="userSex"
                onChange={handleChange} />
            </label>
          </div>
        </div>
        <div>
          <hr></hr>
          <label className={SignUpStyles.infoOptionalText}>
            이용약관 및 개인정보수집 및 이용에 동의합니다.
            <input type="checkbox" checked={checked} onChange={handleCheck} />
          </label>
          <p className={SignUpStyles.infoOptionalText}>이용약관<br />개인정보 수집 및 이용 동의</p>
          <hr></hr>
        </div>
        <div>
          <UserButton
            disabled={true}
            text="회원가입" />
        </div>
      </div>

      {/*<toSignUp />*/}
    </div>
  );

};

export default SignUp;