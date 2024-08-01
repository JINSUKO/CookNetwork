/* Navbar.jsx 
수평 네비게이션바
네비게이션바는 react-router-dom 라이브러리 사용 (npm install react-router-dom)
*/

import React from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import '../assets/styles/Navbar.css'
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';


function NavbarElement() {
  return (
    <div>
      {/* 상단오른쪽 공지사항, 회원가입, 로그인 페이지 이동 */}
      <Nav className="justify-content-end flex-nowrap" defaultActiveKey="/" as="ul">
        <Nav.Item as="li">
          <Nav.Link as={Link} to="/">공지사항</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link as={Link} to="/signup">회원가입</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link as={Link} to="/login">로그인</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* 헤더 아래 네비바 */}
      <Navbar sticky="top" expand="lg" className="bg-body-tertiary flex-nowrap">
        <Container fluid>
          <Navbar.Brand href="/" bg="light" data-bs-theme="light">CookNetwork</Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          {/* <Navbar.Collapse id="basic-navbar-nav"> */}
          <Nav className="me-auto flex-nowrap w-100">
            <Nav.Link href="/korean">한식</Nav.Link>
            <Nav.Link href="/western">양식</Nav.Link>
            <Nav.Link href="/chinese">중식</Nav.Link>
            <Nav.Link href="/japanese">일식</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              className="me-2 search-input"
              aria-label="Search"
            />
            <Button className="search-button" variant="outline-dark">검색</Button>
          </Form>
        </Container>
      </Navbar>

    </div>
  )
}

export default NavbarElement;