/* Logo.jsx
로고 클릭시 메인으로 이동
*/

import React from "react";
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/">
      <img src={logo} alt="로고 이미지" width={200}/>
    </Link>
  )
}
export default Logo;