/* Navbar.jsx 
수평 네비게이션바
네비게이션바는 react-router-dom 라이브러리 사용 (npm install react-router-dom)
*/

import React from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import '../assets/styles/Navbar.css'
import { Container, Nav, Navbar } from 'react-bootstrap';

function NavbarElement() {
  return (
    <div>


<Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">메인</Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        {/* <Navbar.Collapse id="basic-navbar-nav"> */}
          <Nav className="me-auto">
            <Nav.Link href="/korean">한식</Nav.Link>
            <Nav.Link href="/western">양식</Nav.Link>
            <Nav.Link href="/chinese">중식</Nav.Link>
            <Nav.Link href="/japanese">일식</Nav.Link>
          </Nav>
        {/* </Navbar.Collapse> */}
      </Container>
    </Navbar>



    </div>
  )
}

export default NavbarElement;
