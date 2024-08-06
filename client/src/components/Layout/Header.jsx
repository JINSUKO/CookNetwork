import React from "react";
import Logo from "../Logo.jsx";
import NavbarElement from "../NavbarElement";

function Header({user}) {

  return ( 
    <header>
      <Logo />
      <NavbarElement user={user}/>
    </header>
  )
}

export default Header;