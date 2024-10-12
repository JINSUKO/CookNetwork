import React from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";

function Footer() {
  const footerStyle = {
    backgroundColor: '#ffffff',
    padding: '40px 0 20px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '15px',
  };

  
  return ( 
    <footer style={footerStyle}>
      <p>Copyright ⓒ 2024 Cook Network 팀<br />
      이 프로젝트는 코드랩아카데미의 교육 과정의 일환으로 개발되었습니다.</p>
    </footer>
  )
}

export default Footer;