/* 회원가입 페이지
*/

import React, { isValidElement, useState } from 'react';
import UserButton from '../components/UI/UserButton.jsx';



function SignUp() {
  const [user, setUser] = useState({
    userID: '',
    password: '',
    passwordVerify: '',
    nickname: '',
    userSex: '',
    userEmail: ''
  });


  const { userId, password, passwordVerify, nickname, userSex, userEmail } = user;


  // 아이디 유효성검사
  // const handleId = (e) => {
  //   setId(e.target.value);
  //   const regex =    // 정규표현식 사용 
  // }

  // 이용약관 동의 체크박스 
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };

  return (
    <div className="page">
      <div className="titleWrap">회원가입</div>
      <div className="contentWrap">
        <div className="userInputFrame">
          <p className="infoOptionalText">아래에 정보를 입력해주세요.</p>
          <input
            className='userInput'
            type="text"
            placeholder="아이디"
            value={userId}
            name="userId" />
          <div className="errorMessageWrap">올바른 아이디를 입력해주세요.</div>
          <input
            className='userInput'
            type="text"
            placeholder="비밀번호"
            value={password}
            name="password"
          />
          <div className="errorMessageWrap">영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
          <input
            className='userInput'
            type="text"
            placeholder="비밀번호 확인"
            value={passwordVerify}
            name="passwordVerify"
          />
          <div className="errorMessageWrap">비밀번호를 확인해주세요.</div>
          <input
            className='userInput'
            type="text"
            placeholder="닉네임"
            value={nickname}
            name="nickname"
          />
          <input
            className='userInput'
            type="text"
            placeholder="이메일"
            value={userEmail}
            name="userEmail"
          />
          <div value={userSex}>
            <div className="errorMessageWrap">올바른 이메일 형식이 아닙니다.</div>
            <label className="infoOptionalText">성별<br />
              남성<input
                className='userSexRadio'
                type="radio"
                value="male"
                name="userSex" />
              여성<input
                className='userSexRadio'
                type="radio"
                value="female"
                name="userSex" />
            </label>
          </div>
        </div>
        <div>
          <hr></hr>
          <label className='infoOptionalText'>
            이용약관 및 개인정보수집 및 이용에 동의합니다.
            <input type="checkbox" checked={checked} onChange={handleCheck} />
          </label>
          <p className='infoOptionalText'>이용약관<br />개인정보 수집 및 이용 동의</p>
          <hr></hr>
        </div>
        <div>
          <UserButton
            disabled={true}
            // onClick={processSignUp} 
            text="회원가입" />
        </div>
      </div>
    </div>
  );
}


export default SignUp;