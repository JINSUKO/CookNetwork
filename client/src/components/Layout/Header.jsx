import React from "react";
import logo from '../../assets/images/logo.png';
import NavbarElement from "../NavbarElement.jsx";

function Header({user}) {

  return ( 
    <header>
      <img src={logo} alt="로고 이미지" width={200}/>
      <NavbarElement user={user} />
    </header>
  )
}

export default Header;