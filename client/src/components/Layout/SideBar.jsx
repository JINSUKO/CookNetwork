/** SideBar.jsx
 * 네비게이션 메뉴 버튼을 클릭했을 때 왼쪽에 나타나는 사이드바 입니다.
 * 마이페이지, 레시피 작성페이지 등 이동 메뉴
 */

import React from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../../assets/styles/SideBar.module.css'

function LeftSidebar({ show, handleClose, user }) {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className={`d-flex flex-column ${styles.offcanvasBody}`}>
        <Nav className="flex-column flex-grow-1">
          <Nav.Link as={Link} to="/mypage" onClick={handleClose} className={styles.navLink}>마이페이지</Nav.Link>
          <Nav.Link as={Link} to="/mybookmark" onClick={handleClose} className={styles.navLink}>북마크한 레시피</Nav.Link>
          <Nav.Link as={Link} to="/writerecipe" onClick={handleClose} className={styles.navLink}>나만의 레시피 등록</Nav.Link>
          <Nav.Link as={Link} to="/myrecipe" onClick={handleClose} className={styles.navLink}>나만의 레시피 관리</Nav.Link>
        </Nav>
          
          {user ? (
            <Nav.Link to="/mypage" onClick={handleClose} className={styles.profileSection}>
              <img 
                src={user.user_img || "/profile.png"} 
                alt="회원 프로필 이미지" 
                className={styles.profileImage}
              />
              <span className={styles.profileName}>{user.username}</span>
            </Nav.Link>
        ) : (
          <Nav.Link as={Link} to="/login" onClick={handleClose} className={styles.profileSection}>
            <img 
              src={"/profile.png"} 
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