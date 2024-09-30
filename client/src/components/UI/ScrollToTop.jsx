/** ScrollToTop.jsx
 * 레시피 리스트 페이지와 레시피 상세 페이지에서 사용되는 Top 버튼 컴포넌트
 * 함수 handleShowButton: 스크롤을 내리면 Top버튼이 나타남
 * 함수 scrollToTop: 버튼을 누르면 스크롤이 최상단으로 이동
 */

import React, { useState, useEffect } from 'react';
import styles from '../../assets/styles/ScrollToTop.module.css';

function ScrollToTop () {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleShowButton  = () => {
      if (window.scrollY > 200) {   // 스크롤을 500만큼 내렸을 때 버튼이 나타남
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    };
    // scroll 이벤트를 감지하여 handleShowButton 함수 호출
    window.addEventListener("scroll", handleShowButton)
    return () => { 
      window.removeEventListener("scroll", handleShowButton)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return showButton ? (
    <div className={styles.scrollContainer}>
      <button className={styles.Btn} onClick={scrollToTop} type="button" >
        <svg height="1.2em" className={styles.arrow} viewBox="0 0 512 512">
          <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
        </svg>
      </button>
    </div>
  ) : null;
};

export default ScrollToTop;