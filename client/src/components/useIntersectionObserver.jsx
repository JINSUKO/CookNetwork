/** useIntersectionObserver.jsx
 * useIntersectionObserver custom Hook
 * -활용예시
 * [ ] 무한스크롤 
 * [ ] 지연 로딩
 * [ ] 스켈레톤 UI
 * 참고:https://velog.io/@yunsungyang-omc/React-무한-스크롤-기능-구현하기-used-by-Intersection-Observer-2
 */

import { useState, useEffect, useCallback } from 'react';

// 옵션값 지정
const defaultOption = {
  root: null,
  threshold: 0.5,
  rootMargin: '0px'
};

// 커스텀 훅 부분
// ref값으로 관찰 대상을 지정하고 useState를 사용해 state로 관리.
const useIntersect = (onIntersect, option) => {
  const [ref, setRef] = useState(null);
  // 관찰자 생성
  const checkIntersect = useCallback(([entry], observer) => {
    if (entry.isIntersecting) {
      onIntersect(entry, observer)
    }
  }, []);


  
}



function useIntersectionObserver(onIntersect, options = {}) {
  const callback = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        onIntersect();
      }
    },
    [onIntersect]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    const element = document.getElementById('observer');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [callback, options]);
}

export default useIntersectionObserver;