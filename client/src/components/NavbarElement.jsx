/* NavbarElement.jsx 
-react-router-dom 라이브러리 사용 (npm install react-router-dom)
-useNavigate 훅을 사용하여 검색어를 파라미터로 전달
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import FilteredResult from './FilteredResult';
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../assets/styles/Navbar.css'

function NavbarElement({ user }) {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  // 검색을 수행하는 함수
  const handleSearch = (searchKeyword, category) => {
    setSearchKeyword(searchKeyword)
    navigate(`/search?q=${encodeURIComponent(searchKeyword)}&category=${encodeURIComponent(category)}`);
  };

  // 카테고리 배열 정의
  const categories = [
    { name: '전체', path: '/' },
    { name: '한식', path: 'category/korean' },
    { name: '양식', path: 'category/western' },
    { name: '중식', path: 'category/chinese' },
    { name: '일식', path: 'category/japanese' }
  ];

  return (
    <div>
      {/* 상단오른쪽 공지사항, 회원가입, 로그인 링크도 네비바로 작성 */}
      <Nav className="justify-content-end" defaultActiveKey="/" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/board">공지사항</Nav.Link>
        </Nav.Item>
         {
          <>
          {
            user ? (
                <>
                  <Nav.Item as="li">
                    <Nav.Link href="/mypage">마이페이지</Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link href="/logout">로그아웃</Nav.Link>
                  </Nav.Item>
                </>
            ) : (
                <>
                  <Nav.Item as="li">
                    <Nav.Link href="/signup">회원가입</Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link href="/login">로그인</Nav.Link>
                  </Nav.Item>
                </>
            )
          }
          </>
      }
      </Nav>

      {/* 헤더 아래 네비바 */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="d-flex justify-content-between align-items-center flex-nowrap ">
          <Nav className="mx-auto d-flex justify-content-center flex-grow-1 flex-shrink-0" style={{ overflow: 'visible' }}>
            {/* <Navbar.Brand href="/" bg="light" data-bs-theme="light" className="flex-shrink-0">전체</Navbar.Brand> */}

            {categories.map((category) => (
              <Nav.Item key={category.path}>
                <Link 
                  to={category.path} 
                  className="nav-link px-2"
                >{category.name}
                </Link>
              </Nav.Item>
            ))}

          </Nav>
          <SearchBar onSearch={handleSearch} />
        </Container>
      </Navbar>

    </div>
  )
}

export default NavbarElement;