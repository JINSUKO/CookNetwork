import { useEffect, useCallback } from 'react';

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