/* useInfiniteScroll.jsx
무한스크롤 커스텀 훅
Intersection Observer 설정?

*/

import { useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfinityScroll (queryKey, fetchFunction){ 
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFunction(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1
    }
  );

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  /*
  handleObserver: 교차점이 발생했을 때 실행되는 콜백 함수.
  entries: 교차점 정보를 담는 배열
  isIntersecting: 교차점(intersection)이 발생한 요소의 상태
  교차점이 발생하면 page 1 증가
  */

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0, //  Intersection Observer의 옵션, 0일 때는 교차점이 한 번만 발생해도 실행, 1은 모든 영역이 교차해야 콜백 함수가 실행.
    });
    // 최하단 요소를 관찰 대상으로 지정함
    const observerTarget = document.getElementById("observer");
    // 관찰 시작
    if (observerTarget) {
      observer.observe(observerTarget);
    }
    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, [handleObserver]);
  
  return {
    data: data?.pages.flat() || [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}

export default useInfinityScroll;


/* 공식문서에서 제공된 useInfiniteQuery 
const {
  fetchNextPage, // 다음 페이지를 호출하는 함수
  fetchPreviousPage, //이전 페이지를 호출하는 함수
  hasNextPage, //다음 페이지를 가지고 있는지(마지막 페이지인지 판단 t/f)
  hasPreviousPage, //이전 페이지를 가지고 있는지
  isFetchingNextPage, //다음 페이지를 호출 중인지 = isLoading과 같은 개념
  isFetchingPreviousPage, //이전 페이지를 호출 중인지
  ...result
} = useInfiniteQuery({
  queryKey, //고유 쿼리키
  queryFn: ({ pageParam = 1 }) => fetchPage(pageParam), //페이지는 1부터 시작해서 넘겨준다
  ...options,
  getNextPageParam: (lastPage, allPages) => lastPage.nextCursor, //lastPage가 true면 다음 페이지를 요청
  getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor, //위와 동일하게 이전 페이지 요청
})
출처: https://peripheral-nerv.tistory.com/entry/리액트에서-무한스크롤-구현하기React-query-react-intersection-observer-사용 [bimnemo("개발"):티스토리]

*/