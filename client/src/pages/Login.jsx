/* 
로그인 페이지
*/

import React, { useState } from 'react';
import styles from '../assets/styles/Login.module.css';

function Login() {

  const API_URL = 'http://localhost:5000';

  const [user, setUser] = useState({
    userId: '',
    password: '',
  });

  const { userId, password } = user;

  const [errors, setErrors] = useState({
    userId: '',
    password: ''
    });

  // onChange 함수
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser ({
      ...user,
      [name]: value
    });
  };

  // onSubmit 함수
  const handleSubmit = async (event) => {
    event.preventDefault();  // submit을 할 때 제출 방지
    console.log(user);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });

      console.log('응답 상태:', response.status)

      if (response.ok) {
        // 로그인 성공 
        console.log('로그인 성공:', data.user);
        // 여기서 로그인 성공 후 토큰 저장, 리다이렉트 등 로직을 구현합니다.
      
      } else {
        setErrors( {general: data.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'});
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setErrors({ gnenral:'서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
  }

  // 응답받은 데이터 활용, 로그인 상태 유지


  return (
    <div className={styles.page}>
      <div className={styles.titleWrap}>Login</div>
      <form className={styles.userInputFrame} onSubmit={handleSubmit}>
        <label>아이디</label>
        <input 
        className={styles.userInput}
        name="userId"
        value={userId} 
        type="text" 
        placeholder="아이디" 
        onChange={handleChange} 
        />
        <label>비밀번호</label>
        <input 
        className={styles.userInput}
        name="password"
        value={password}
        type="password" 
        placeholder="비밀번호" 
        onChange={handleChange} 
        />
        <button className={styles.userButton} type="submit" value="Login" >로그인
        </button>
      </form>
    </div>
  )
}


export default Login;