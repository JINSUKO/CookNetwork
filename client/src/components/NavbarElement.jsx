/* NavbarElement.jsx 
-react-router-dom 라이브러리 사용 (npm install react-router-dom)
-useNavigate 훅을 사용하여 검색어를 파라미터로 전달
[ ] 
*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../assets/styles/Navbar.css'

function NavbarElement({ user }) {

  // 카테고리 배열 정의
  const categories = [
    { name: '전체', path: '/' },
    { name: '한식', path: 'category/한식' },
    { name: '양식', path: 'category/양식' },
    { name: '중식', path: 'category/중식' },
    { name: '일식', path: 'category/일식' }
  ];

  const handleSearch = (searchInput, selectedCategory) =>{
    console.log(`검색어: ${searchInput} in 카테고리: ${selectedCategory}`);
  }
  

  return (
    <div>
      {/* 상단오른쪽 공지사항, 회원가입, 로그인 링크도 네비바로 작성 */}
      <Nav className="justify-content-end" defaultActiveKey="/" as="ul">
        <Nav.Item as="li">
          <Link to="/bookmark" className='nav-link'>북마크</Link>
          <Link to="/board" className='nav-link'>공지사항</Link>
        </Nav.Item>
         {
          <>
          {
            user ? (
                <>
                  <Nav.Item as="li">
                    <Link to="/mypage" className='nav-link'>마이페이지</Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Link to="/logout" className='nav-link'>로그아웃</Link>
                  </Nav.Item>
                </>
            ) : (
                <>
                  <Nav.Item as="li">
                    <Link to="/signup" className='nav-link'>회원가입</Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Link to="/login" className='nav-link'>로그인</Link>
                  </Nav.Item>
                </>
            )
          }
          </>
      }
      </Nav>

      {/* 헤더 아래 네비바 */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="d-flex justify-content-center align-items-center flex-nowrap ">
          <Nav className="mx-auto d-flex justify-content-evenly flex-grow-1 flex-shrink-0" style={{ overflow: 'visible' }}>

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
          
        </Container>
        <Container className='d-flex justify-content-center'>
          <SearchBar onSearch={handleSearch}/>
        </Container>
      </Navbar>

    </div>
  )
}

export default NavbarElement;