import React, { useState, useEffect, useCallback } from "react";
import { Container } from 'react-bootstrap';
import { useBookmarkContext } from "../../context/BookmarkContext";
import RecipeListPage from "../../pages/RecipeListPage";
// import Loading from "../../components/UI/Loading";
import Skeleton from "../../components/UI/Skeleton";

function BookmarkPage() {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { fetchBookmark } = useBookmarkContext();

  const fetchBookmarkedRecipes = useCallback(async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const response = await fetchBookmark(pageNum);
      if (response && response.recipes) {
        if (pageNum === 1) {
          setBookmarkedRecipes(response.recipes);
        } else {
          setBookmarkedRecipes(prevRecipes => [...prevRecipes, ...response.recipes]);
        }
        setHasMore(response.recipes.length === 10); // Assuming 10 recipes per page
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("북마크 레시피 불러오기 실패:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBookmark]);

  useEffect(() => {
    fetchBookmarkedRecipes(1);
  }, [fetchBookmarkedRecipes]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBookmarkedRecipes(nextPage);
    }
  }, [isLoading, hasMore, page, fetchBookmarkedRecipes]);

  return (
    <Container>
      {isLoading && bookmarkedRecipes.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Skeleton />
        </div>
      ) : (
        <>
          <h5>내 북마크 레시피<br/>좋아하는 레시피를 확인해보세요!</h5>
          <RecipeListPage 
            recipes={bookmarkedRecipes}
            hasMore={hasMore}
            loadMore={loadMore}
            isLoading={isLoading}
            totalCount={bookmarkedRecipes.length}
            isBookmarkPage={true}
          />
        </>
      )}
    </Container>
  );
}

export default BookmarkPage;

// /** BookmarkList.jsx
//  * 북마크 레시피 리스트 컴포넌트
//  * RecipeListPage.jsx 레시피 리스트 컴포넌트에 북마크된 레시피 렌더링
//  */

// import React, { useState, useEffect, useCallback } from 'react';
// import { Container } from 'react-bootstrap';
// import { useBookmarkContext } from '../../context/BookmarkContext';
// import RecipeListPage from '../../pages/RecipeListPage';
// import Loading from '../UI/Loading'
// import Skeleton from "../components/UI/Skeleton";

// const BookmarkList = () => {
//   const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const { fetchBookmark } = useBookmarkContext();
//   const API_URL = import.meta.env.VITE_HOST_IP;

//   const fetchBookmarkedRecipes = useCallback(async (pageNum = 1) => {
//     try {
//       setIsLoading(true);
//       const response = await fetchBookmark(pageNum);
//       if (response && response.recipes) {
//         if (pageNum === 1) {
//           setBookmarkedRecipes(response.recipes)
//         }
//       }
//     }
//   })

//   const { isBookmarked, removeBookmark, loading, error } = useBookmarkContext();
//   const isLoggedIn = !!localStorage.getItem('loginUser');

//   if (!isLoggedIn) {
//     return <div>로그인이 필요한 서비스입니다.</div>;
//   }

//   if (loading) return <div><Loading /></div>;
//   if (error) return <div>Error: {error}</div>;

//   if (!Array.isArray(bookmarkedRecipes) || bookmarkedRecipes.length === 0) {
//     return <div className="d-flex justify-content-center align-items-center">북마크한 레시피가 없습니다.</div>;
//   }

//   return (
//     <Container>
//       {isLoading && bookmarkedRecipes.length === 0 ? (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//           <Skeleton/>
//         </div>
//       ) : (
//         <>
//           <h5>내 북마크 레시피</h5>
//           <RecipeListPage
//             recipes={bookmarkedRecipes}
//             // currentCategory="bookmark"
//             hasMore={hasMore}
//             loadMore={loadMore}
//             isLoading={isLoading}
//             totalCount={bookmarkedRecipes.length}
//             />
//           </>
//       )}
//     </Container>
//   );
// };

// export default BookmarkList;