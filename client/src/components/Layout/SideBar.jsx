/** SideBar.jsx
 * 네비게이션 메뉴 버튼을 클릭했을 때 왼쪽에 나타나는 사이드바 입니다.
 * 마이페이지, 레시피 작성페이지 등 이동 메뉴
 */

import React, { useState } from 'react';
import { Offcanvas, Nav, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../../assets/styles/SideBar.module.css'

function LeftSidebar({ show, handleClose, user }) {
  const [profileImgDBbase64, setProfileImgDBbase64] = useState(user?.user_img || 'profile.png');

  // 로그인 유저와 비로그인 유저에게 다른 메뉴 표시
  const loggedInMenu = [
    { to: "/mypage", text: "마이페이지" },
    { to: "/mybookmark", text: "북마크한 레시피" },
    { to: "/popular", text: "인기 레시피" },
    // { to: "/categories", text: "레시피 카테고리" },
    { to: "/writerecipe", text: "나만의 레시피 등록" },
    { to: "/myrecipe", text: "나만의 레시피 관리" },
    { to: "/about", text: "서비스 소개" },
  ];

  const loggedOutMenu = [
    { to: "/login", text: "로그인" },
    { to: "/signup", text: "회원가입" },
    { to: "/mypage", text: "마이페이지" },
    { to: "/mybookmark", text: "북마크한 레시피" },
    { to: "/best", text: "인기 레시피" },
    // { to: "/categories", text: "레시피 카테고리" },
    { to: "/about", text: "서비스 소개" },
  ];

  const currentMenu = user ? loggedInMenu : loggedOutMenu;

  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className={`d-flex flex-column ${styles.offcanvasBody}`}>
        <Nav className="flex-column flex-grow-1">

          {currentMenu.map((item, index) => (
            <Nav.Link
              key={index}
              as={Link}
              to={item.to}
              onClick={handleClose}
              className={styles.navLink}
            >
              {item.text}
            </Nav.Link>
          ))}
          
        </Nav>
          
          {user ? (
            <Nav.Link to="/mypage" onClick={handleClose} className={styles.profileSection}>
              <Image 
                src={user.user_img || profileImgDBbase64} 
                alt="회원 프로필 이미지" 
                className={styles.profileImage}
              />
              <span className={styles.profileName}>{user.username}</span>
            </Nav.Link>
        ) : (
          <Nav.Link as={Link} to="/login" onClick={handleClose} className={styles.profileSection}>
            <img 
              src={profileImgDBbase64} 
              alt="회원 프로필 이미지" 
              className={styles.profileImage}
            />
            <span className={styles.profileName}>로그인 후 이용하실 수 있습니다.</span>
          </Nav.Link>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default LeftSidebar;