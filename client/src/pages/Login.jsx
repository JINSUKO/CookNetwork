/* 
로그인 페이지
*/

import React, { isValidElement, useState } from 'react';
import UserButton from '../components/UI/UserButton';
// import LoginStyles from '../assets/styles/Login.module.css';

function Login() {
  const [user, setUser] = useState({
    userId: '',
    password: ''
  });
  const onIdChange = (e) => {
    setId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // submit을 할 때 페이지 자체가 새로고침이 되는 것을 막음
    console.log(id);


  };

  return (
    <div>
      <div className="titleWrap">Login</div>
      <form className="userInputFrame" onSubmit={handleSubmit}>
        <input onChange={handleChange} value={id} type="text" placeholder="아이디" />
        <input type="password" placeholder="비밀번호" />
        <input className="btn" type="submit" value="Login" />
      </form>
    </div>
  )
};

export default Login;