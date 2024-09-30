import React, { useState, useEffect } from 'react';
import styles from '../../assets/styles/ScrollToTop.module.css';

function ScrollToTop () {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleShowButton  = () => {
      if (window.scrollY > 500) {   // 스크롤을 500만큼 내렸을 때 버튼이 나타남
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    };

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

  return showButton && (
    <div className={styles.scrollContainer}>
      <button id="top" onClick={scrollToTop} type="button" >Top</button>
    </div>
  );
};

export default ScrollToTop;