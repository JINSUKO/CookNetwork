import React from "react";
import Logo from "../Logo.jsx";
import NavbarElement from "./NavbarElement";
import styles from "../../assets/styles/Header.module.css";

function Header({user}) {

  return ( 
    <header className={styles.header}>
      <Logo className={styles.logoContainer}/>
      <NavbarElement user={user}/>
    </header>
  )
}

export default Header;