/* 
로그인 페이지
*/

import React, { useState } from 'react';
import styles from '../assets/styles/Login.module.css';

function Login() {

  const API_URL = 'http://localhost:3000';

  const [user, setUser] = useState({
    userId: '',
    password: '',
  });

  const { userId, password } = user;

  // onChange 함수
  const handleChange = (event) => {
    validateForm(event)   
    const { name, value } = event.target;
    setUser ({
      ...user,
      [name]: value
    });
  };

  // 유효성검사 
  const [errors, setErrors] = useState({});

  const validateForm = (event) => {   // 유효성 검사 함수 
    let inputError = {};    // inputError 객체
    event.preventDefault();   // 제출 방지

    // 정규식 패턴
    const regId = /^[0-9a-z]{8,16}$/;
    const regPw = /^[0-9a-zA-Z]{8,16}$/;

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
   
    // 입력 누락 검사
    if (!userId || !password) {
      inputError.general = "모든 필드는 필수입니다.";
    }

    setErrors(inputError);

    // 유효성검사 함수 Boolean 값 반환
    return Object.keys(inputError).length === 0;

  }
  // onSubmit 함수
  const handleSubmit = async (event) => {
    event.preventDefault();  // submit을 할 때 제출 방지
    console.log(user);

    // setErrors('');

    const input={
      userId: user.userId,
      password: user.password
    }

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공 
        console.log('로그인 성공:', data.user);
        // 여기서 로그인 성공 후 토큰 저장, 리다이렉트 등 로직을 구현합니다.
      
      } else {
        setErrors(data.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setErrors('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  // 응답받은 데이터 활용, 로그인 상태 유지


  return (
    <div className={styles.page}>
      <div className={styles.titleWrap}>Login</div>
      <form className={styles.userInputFrame} action="/" onSubmit={handleSubmit}>
        <label>아이디</label>
        <input 
        className={styles.userInput}
        name="userId"
        value={user.userId} 
        type="text" 
        placeholder="아이디" 
        onChange={handleChange} 
        />
        <div className={styles.errorMessageWrap}>{errors.userId}</div>
        <label>비밀번호</label>
        <input 
        className={styles.userInput}
        name="password"
        value={user.password}
        type="password" 
        placeholder="비밀번호" 
        onChange={handleChange} 
        />
        <div className={styles.errorMessageWrap}>{errors.password}</div>
        <button className={styles.userButton} type="submit" value="Login" onSubmit={handleSubmit}>로그인
        </button>
      </form>
    </div>
  )
}


export default Login;