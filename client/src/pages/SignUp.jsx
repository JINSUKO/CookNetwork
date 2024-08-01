/* 회원가입 페이지
*/

import React, { useState } from 'react';
import SignUpStyles from '../assets/styles/SignUp.module.css';


function SignUp({ onSignUp }) {   // onSignUp props로 handleSignUp 함수를 전달
  const [user, setUser] = useState({
    userId: '',
    password: '',
    passwordVerify: '',
    nickname: '',
    userSex: 0,
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

  const validateForm = (event) => {   // 유효성 검사 함수 validateForm
    let inputError = {};    // inputError 객체
    event.preventDefault();   // 제출 방지

    // 정규식 패턴
    const regId = /^[0-9a-z]{8,16}$/;
    const regPw = /^[0-9a-zA-Z]{8,16}$/;
    const regNickname = /^[a-zA-Z가-힣]{2,16}$/;
    const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 아이디
    if (!regId.test(user.userId)) {
      // setUser(prevState => ({ ...prevState, userId: '' }));
      inputError.userId = "8-16자 영어 소문자+숫자로 작성하세요.";
    }
    // 비밀번호
    if (!regPw.test(user.password)) {
      // setUser(prevState => ({ ...prevState, pw: '' }));
      inputError.password = "8-16자 영어+숫자로 작성하세요.";
    }
    // 비밀번호 확인
    if (user.password !== user.passwordVerify) {
      // setUser(prevState => ({ ...prevState, pw: '', checkpw: '' }));
      inputError.passwordVerify = "비밀번호가 일치하지 않습니다.";
    }
    // 이메일
    if (!regEmail.test(user.userEmail)) {
      // setUser(prevState => ({ ...prevState, userEmail: '' }));
      inputError.userEmail = "올바른 이메일 주소를 입력하세요.";
    }
    // 닉네임 
    if (!regNickname.test(user.nickname)) {
      // setUser(prevState => ({ ...prevState, nickname: '' }));
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

    // 유효성검사 함수 Boolean 값 반환
    return Object.keys(inputError).length === 0;
  }




  // 이용약관 동의 체크박스 
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };

  //onSubmit 함수
  const handleSubmit = async (event) => {
    event.preventDefault(); // 제출 방지
    console.log(user);
    
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

      onSignUp(input);
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
          <label className="infoOptionalText">아이디
            <input
            className={SignUpStyles.userInput}
            type="text"
            placeholder="아이디"
            value={user.userId}
            name="userId"
            onChange={handleChange} />
          </label>
          <div className={SignUpStyles.errorMessageWrap}>{errors.userId}</div>
          <label className="infoOptionalText">비밀번호<input
            className={SignUpStyles.userInput}
            type="password"
            placeholder="비밀번호"
            value={user.password}
            name="password"
            onChange={handleChange}
          />
          </label>
          <div className={SignUpStyles.errorMessageWrap}>{errors.password}</div>
          <label className="infoOptionalText">비밀번호 확인<input
            className={SignUpStyles.userInput}
            type="password"
            placeholder="비밀번호 확인"
            name="passwordVerify"
            value={user.passwordVerify}
            onChange={handleChange}
          />
          </label>
          <div className={SignUpStyles.errorMessageWrap}>{errors.nickname}</div>
          <label className="infoOptionalText">닉네임
            <input
            className={SignUpStyles.userInput}
            type="text"
            placeholder="닉네임"
            value={user.nickname}
            name="nickname"
            onChange={handleChange}
          />
          </label>
          <div className={SignUpStyles.errorMessageWrap}>{errors.userEmail}</div>
          <label className="infoOptionalText">이메일
            <input
            className={SignUpStyles.userInput}
            type="text"
            placeholder="이메일"
            value={user.userEmail}
            name="userEmail"
            onChange={handleChange}
          />
          </label>

          <div value={userSex}>
            <label className="infoOptionalText">성별<br />
            </label>
            <label>
              남성<input
                className={SignUpStyles.userSexRadio}
                type="radio"
                value= "0"
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
          <p className={SignUpStyles.infoOptionalText}>이용약관<br />ex.개인정보 수집 및 이용 동의</p>
          <hr></hr>
        </div>
        <div>
          <button
            className={SignUpStyles.userButton}
            type="submit"
            text="회원가입"
            value="SignUp" 
            />
        </div>
      </form>
    </div>
  );
};

export default SignUp;