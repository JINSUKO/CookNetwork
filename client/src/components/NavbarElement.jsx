/* NavbarElement.jsx 
수평 네비게이션바
네비게이션바는 react-router-dom 라이브러리 사용 (npm install react-router-dom)
*/

import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css'
import { Container, Nav, Navbar, Form, Button } from 'react-bootstrap';


function NavbarElement() {
  return (
    <div>
      {/* 추가: 상단오른쪽 공지사항, 회원가입, 로그인 링크 */}
      <Nav className="justify-content-end" defaultActiveKey="/" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/">공지사항</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link href="/signup">회원가입</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link href="/login">로그인</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* 헤더 아래 네비바 */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="d-flex justify-content-between align-items-center flex-nowrap">
          <Navbar.Brand href="/" bg="light" data-bs-theme="light" className="flex-shrink-0">전체</Navbar.Brand>
          <Nav className="mx-auto d-flex justify-content-center flex-grow-1 flex-shrink-0" >
            <Nav.Link href="/korean" className="px-2">한식</Nav.Link>
            <Nav.Link href="/western" className="px-2">양식</Nav.Link>
            <Nav.Link href="/chinese" className="px-2">중식</Nav.Link>
            <Nav.Link href="/japanese" className="px-2">일식</Nav.Link>
          </Nav>
          <Form className="d-flex flex-shrink-0" >
            <Form.Control
              type="search"
              placeholder="레시피 또는 셰프"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">검색</Button>
          </Form>
        </Container>
      </Navbar>

    </div>
  )
}

export default NavbarElement;