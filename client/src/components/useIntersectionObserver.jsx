/** useIntersectionObserver.jsx
 * useIntersectionObserver custom Hook
 * -활용예시
 * [ ] 무한스크롤 
 * [ ] 지연 로딩
 * [ ] 스켈레톤 UI
 * 참고:https://velog.io/@yunsungyang-omc/React-무한-스크롤-기능-구현하기-used-by-Intersection-Observer-2
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// 옵션값 지정
const defaultOptions = {
  root: null,
  threshold: 1.0,
  rootMargin: '0px'
};

// 커스텀 훅 부분
// ref값으로 관찰 대상을 지정하고 useState를 사용해 state로 관리.

function useIntersectionObserver(onIntersect, options = {}) {
  const targetRef = useRef(null);
  const [ref, setRef] = useState(null);

  const callback = useCallback((entries) => {   // 
    const [entry] = entries;      // entry를 리스트로 
    if (entry.isIntersecting) {
      onIntersect(entry);  // 
    }
  }, [onIntersect]);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, { ...defaultOptions, ...options });  //
    const currentTarget  = document.getElementById('observer');
    if (currentTarget ) observer.observe(currentTarget);

    return () => {
      if (currentTarget ) observer.unobserve(currentTarget);
    };
  }, [callback, options]);

  return targetRef;
}

export default useIntersectionObserver;