/** BookmarkButton.jsx
 * 레시피 상세 페이지 내 북마크 추가 버튼
 * 북마크 버튼 UI: react-icons 라이브러리 사용
 * 
 * 함수: fetchBookmarkStatus
 * 함수: handleBookmark
 */

import React, { useState, useEffect, useContext } from 'react';
import { useBookmarkContext } from '../../context/BookmarkContext';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import styles from '../../assets/styles/Bookmark.module.css';
import { toast } from 'react-toastify';


function BookmarkButton({ recipe_id }) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();   // useBookmarkContext 훅 사용
  const [bookmarkCount, setBookmarkCount] = useState();

  // useEffect(() => {
  //   // 컴포넌트 마운트 시 북마크 상태 및 카운트 조회
  //   fetchBookmarkStatus();
  // }, [recipe_id]);

  // const fetchBookmarkStatus = async () => {
  //   // [ ] 로그인 계정 정보 연동
  //   try {
  //     const response = await fetch(`/api/bookmark/status/${recipe_id}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include', // 쿠키 포함
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setIsBookmarked(data.isBookmarked);
  //       setBookmarkCount(data.count);
  //     }
  //   } catch (error) {
  //     console.error('북마크 상태 조회 오류:', error);
  //   }
  // };

  // 제거 OR 추가
  // BookmarkContext의 isBookmarked, addBookmark, removeBookmark 함수 호출
    // [ ] 로그인 유저? --> 비로그인: 로그인페이지 리다이렉트
  const handleBookmark = async () => {
    try {
      if (isBookmarked(recipe_id)) {
        await removeBookmark(recipe_id);
        toast.success('북마크가 제거되었습니다.');
      } else {
        await addBookmark(recipe_id);
        toast.success('북마크에 추가되었습니다.');
      }
    } catch (error) {
      console.error('북마크 오류:', error);
      toast.error('잠시후 다시 시도해주세요.')
    }  
  }
  //     const response = await fetch(`/api/bookmark/${recipe_id}`, {
  //       method: isBookmarked ? 'DELETE' : 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include', // 쿠키 포함
  //     });

  //     if (response.ok) {
  //       setIsBookmarked(!isBookmarked);
  //       toast.success(isBookmarked ? '북마크가 제거되었습니다.' : '북마크에 추가되었습니다.');
  //     } else {
  //       throw new Error('북마크 처리 실패');
  //     }
  //   } catch (error) {
  //     console.error('북마크 오류:', error);
  //     toast.error('잠시후 다시 시도해주세요.');
  //   }
  // }

  return( 
    <div 
      className={`${styles.bookmarkIcon} ${isBookmarked ? styles.bookmarked : ''}`} 
      onClick={handleBookmark}
    >
      {isBookmarked ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
    </div>
  )
};

export default BookmarkButton