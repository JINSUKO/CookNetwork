/** BookmarkButton.jsx
 * 레시피 상세 페이지 내 북마크 추가 버튼
 * 북마크 버튼 UI: react-icons 라이브러리 사용
 * 
 * 함수: fetchBookmarkStatus
 * 함수: handleBookmark
 */

import React, { useState, useEffect, useContext } from 'react';
import { useBookmarkContext } from '../../context/BookmarkContext.jsx';
import { BsBookmark } from '@react-icons/all-files/bs/BsBookmark';
import { BsBookmarkFill } from '@react-icons/all-files/bs/BsBookmarkFill';
import styles from '../../assets/styles/Bookmark.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function BookmarkButton({ recipe_id }) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext(); 
  const [bookmarkCount, setBookmarkCount] = useState();   // [ ] 레시피별 북마크 횟수 
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('loginUser');  

  // 로그인 상태에 따라 북마크 초기 상태 설정
  useEffect(() => {
    if (isLoggedIn) {
      setBookmarked(isBookmarked(recipe_id));
    } else {
      setBookmarked(false);
    }
  }, [isLoggedIn, isBookmarked, recipe_id]);

  // 북마크 제거 OR 추가
  // BookmarkContext의 isBookmarked, addBookmark, removeBookmark 함수 호출
  const handleBookmark = async () => {
    // 비로그인 유저는 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    } 
    try {
      if (isBookmarked(recipe_id)) {
        await removeBookmark(recipe_id);
        setBookmarked(false);
        toast.success('북마크가 제거되었습니다.');
      } else {
        await addBookmark(recipe_id);
        setBookmarked(true);
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

   // 아이콘 색상 및 스타일 설정
  const iconStyle = {
    fill: bookmarked ? '#FFD700' : '#6b6b6b',
    stroke: '#000000',
    strokeWidth: '0.9px',
    opacity: 0.9,
  };

  return( 
    <div 
      className={`${styles.bookmarkIcon} ${bookmarked ? styles.bookmarked : ''}`} 
      onClick={handleBookmark}
    >
      {bookmarked ? <BsBookmarkFill size={16} style={iconStyle}/> : <BsBookmark size={16} style={iconStyle}/>}
    </div>
  )
};

export default BookmarkButton