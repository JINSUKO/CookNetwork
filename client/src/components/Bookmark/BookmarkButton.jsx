/** BookmarkButton.jsx
 * 레시피 상세 페이지 내 북마크 추가 버튼
 */

import React, { useState, useEffect } from 'react';
import { CIcon } from '@coreui/icons-react';
import { cilBookmark } from '@coreui/icons';

function BookmarkButton({ recipe_id, initialIsBookmarked }) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);   // 배열데이터
  const [bookmarkCount, setBookmarkCount] = useState();

  // const dispatch = useDispatch();
  // const { items } = useSelector((state) => state.list);

  const handleBookmark = async () => {

  // 제거 OR 추가 
  try {
    const response = await fetch(`/api/bookmark/${recipe_id}`, {
      method: isBookmarked ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? '북마크가 제거되었습니다.' : '북마크에 추가되었습니다.');
    } else {
      throw new Error('북마크 처리 실패');
    }
  } catch (error) {
    console.error('북마크 오류:', error);
    toast.error('북마크 오류.');
  }
}

  return( 
    <div>
      <CIcon 
          icon={cilBookmark} 
          size="sm" 
          onClick={handleBookmark} 
          isBookmarked={isBookmarked} 
      />
    </div>
  )
};

export default BookmarkButton