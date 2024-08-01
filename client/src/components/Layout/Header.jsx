import React from "react";
import logo from '../../assets/images/logo.png';
import SearchBar from '../SearchBar.jsx';
import NavbarElement from "../NavbarElement.jsx";

function Header() {

  return ( 
    <header>
      <h1>Header 영역</h1>
      <img src={logo} alt="로고 이미지" width={200}/>
      <SearchBar/>
      <NavbarElement />
    </header>
  )
}

export default Header;